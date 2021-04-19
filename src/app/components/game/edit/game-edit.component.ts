import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../../shared/modal/success/modal-success.component';
import {SortableOptions} from 'sortablejs';
import {ModalConfig} from '../../shared/modal/modal.config';
import {AlertConfig} from '../../shared/alert/alert.config';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IGame} from '../../../interfaces/game.interface';
import {ITeam} from '../../../interfaces/team.interface';
import {GameService} from '../../../services/game.service';
import {TeamService} from '../../../services/team.service';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css']
})
export class GameEditComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  game = {} as IGame;
  teams: ITeam[];

  sortOptions: SortableOptions = {
  };

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;
  loadingInTab: boolean;

  // form
  displayEditForm = false;
  editGameForm: FormGroup;
  submitted = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private gameService: GameService,
              private teamService: TeamService) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams.game){
      this.game._id = this.route.snapshot.queryParams.game;
      this.fetchInfos();
      this.refreshData();
      this.createFormControls();
      this.createForms();
    }
    else {
      this.router.navigate(['/games']);
    }
  }

  /******************************************** */
  /************      Forms          *************/
  /******************************************** */

  createFormControls(): void {
    // this.name = new FormControl(null, Validators.required);
  }

  createForms(): void {
    this.editGameForm = new FormGroup({
      // name: this.name,
    });
  }





  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

  onSubmitEditForm(): void{
    this.submitted = true;
    this.dangerAlertConfig = undefined;
    if (this.editGameForm.valid) {
      this.editGame();
      this.editGameForm.reset();
      this.submitted = false;
    }
  }

  onButtonBack(): void {
    this.router.navigate(['/games']);
  }

  async onButtonDeleteTeam(team): Promise<void> {
    this.dangerAlertConfig = undefined;
    this.dangerModalConfig.modalTitle = 'Confirmer la supression ?';
    this.dangerModalConfig.modalText = `Voulez-vous vraiment supprimer l\'équipe ${team.username} ?`;
    this.dangerModalConfig.actionButtonLabel = 'Oui';
    this.dangerModalConfig.dismissButtonLabel = 'Annuler';
    await this.modalDangerComponent.open().then((r) => {
      if (r === 'Oui') {
        this.deleteTeam(team);
      }
    });
  }

  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */

  refreshData(): void{
    this.loadingInTab = true;
    this.dangerAlertConfig = undefined;
    this.teamService.getTeamByGameId(this.game).subscribe((res: ITeam[]) => {
        this.teams = res;
        this.loadingInTab = false;
      },
      error => {
        this.loadingInTab = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération des équipes.';
        this.dangerAlertConfig.alertText = 'La récupération des équipes a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }

  fetchInfos(): void{
    this.loading = true;
    this.gameService.getGameById(this.game).subscribe((res: IGame) => {
        this.game = res;
        this.editGameForm.patchValue(this.game);
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération des infos de la partie.';
        this.dangerAlertConfig.alertText = 'La récupération de la partie a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }





  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */

  deleteTeam(team): void{
    this.teamService.deleteTeam(team).subscribe(async () => {
        this.successModalConfig.modalText = 'Équipe supprimée avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        await this.modalSuccessComponent.open();
        this.refreshData();
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la suppression de l\'équipe ' + team.username;
        this.dangerAlertConfig.alertError = error;
        this.dangerAlertConfig.dismissButton = true;
      });
  }

  editGame(): void{
    /* const toEdit = this.editGeoGroupForm.value as IGeoGroup;
    toEdit._id = this.geoGroup._id;
    toEdit.positionX = this.geoGroup.positionX;
    toEdit.positionY = this.geoGroup.positionY;
    this.geoGroupService.putGeoGroup(toEdit).subscribe(async () => {
        this.successModalConfig.modalText = 'GeoGroup modifiée avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        this.editGeoGroupForm.reset();
        this.displayEditForm = true;
        this.fetchInfos();
        await this.modalSuccessComponent.open();
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la modification du GeoGroup';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.dismissButton = true;
      });*/
  }


}
