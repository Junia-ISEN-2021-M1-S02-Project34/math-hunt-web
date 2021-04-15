import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../../shared/modal/success/modal-success.component';
import {IGeoGroup} from '../../../interfaces/geoGroup.interface';
import {ModalConfig} from '../../shared/modal/modal.config';
import {AlertConfig} from '../../shared/alert/alert.config';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GeoGroupService} from '../../../services/geoGroup.service';
import {Router} from '@angular/router';
import {GameService} from '../../../services/game.service';
import {IGame} from '../../../interfaces/game.interface';
import {TeamService} from '../../../services/team.service';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {IProposition} from '../../../interfaces/proposition.interface';

@Component({
  selector: 'app-game-new',
  templateUrl: './game-new.component.html',
  styleUrls: ['./game-new.component.css']
})
export class GameNewComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;

  // form
  addGameForm: FormGroup;
  name: FormControl;
  duration: FormControl;
  numberOfTeams: FormControl;
  submitted = false;


  constructor(private gameService: GameService,
              private teamService: TeamService,
              private router: Router) { }

  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
  }

  /******************************************** */
  /************      Forms          *************/
  /******************************************** */

  createFormControls(): void {
    this.name = new FormControl(null, Validators.required);
    this.duration = new FormControl(null, Validators.required);
    this.numberOfTeams = new FormControl(null, Validators.required);
  }

  createForm(): void {
    this.addGameForm = new FormGroup({
      name: this.name,
      duration: this.duration,
      numberOfTeams: this.numberOfTeams
    });
  }


  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

  onSubmitAddForm(): void{
    this.submitted = true;
    this.dangerAlertConfig = undefined;
    if (this.addGameForm.valid) {
      this.postGame();
      this.submitted = false;
    }
  }

  onButtonBack(): void {
    this.router.navigate(['/games']);
  }


  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */

  postGame(): void{
    this.loading = true;
    const toAdd = this.addGameForm.value as IGame;
    this.gameService.postGame(toAdd).subscribe(async (game) => {
        this.teamService.postTeams({gameId: game._id, gameName: game.name, numberOfTeams: this.addGameForm.value.numberOfTeams}).subscribe(async () => {
          this.loading = false;
          this.successModalConfig.modalText = 'Partie ajoutée avec succès !';
          this.successModalConfig.closeAfterXSeconds = 3;
          await this.modalSuccessComponent.open().then(() => {
            this.router.navigate(['/games/edit'], { queryParams: { game: game._id } });
          });
        });
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de l\'ajout de la partie';
        this.dangerAlertConfig.alertText = 'La partie que vous essayez d\'ajouter existe peut-être déjà, ou est invalide.';
        this.dangerAlertConfig.dismissButton = true;
      });
  }

}
