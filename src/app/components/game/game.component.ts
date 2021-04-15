import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../shared/modal/success/modal-success.component';
import {ModalConfig} from '../shared/modal/modal.config';
import {AlertConfig} from '../shared/alert/alert.config';
import {Router} from '@angular/router';
import {IGame} from '../../interfaces/game.interface';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  games: IGame[];

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;


  constructor(private gameService: GameService,
              private router: Router) { }

  ngOnInit(): void {
    this.refreshData();
  }


  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

  onButtonEdit(game): void {
    this.router.navigate(['/games/edit'], { queryParams: { game: game._id } });
  }

  onButtonNew(): void{
    this.router.navigate(['/games/new']);
  }

  async onButtonDelete(game): Promise<void> {
    this.dangerAlertConfig = undefined;
    this.dangerModalConfig.modalTitle = 'Confirmer la supression ?';
    this.dangerModalConfig.modalText = `Voulez-vous vraiment supprimer la partie ${game.name} ?`;
    this.dangerModalConfig.actionButtonLabel = 'Oui';
    this.dangerModalConfig.dismissButtonLabel = 'Annuler';
    await this.modalDangerComponent.open().then((r) => {
      if (r === 'Oui') {
        this.deleteGame(game);
      }
    });
  }



  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */

  refreshData(): void{
    this.loading = true;
    this.dangerAlertConfig = undefined;
    this.gameService.getGames().subscribe((res: IGame[]) => {
        this.games = res;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération des parties.';
        this.dangerAlertConfig.alertText = 'La récupération des parties a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }



  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */

  deleteGame(game): void{
    this.gameService.deleteGame(game).subscribe(async () => {
        this.successModalConfig.modalText = 'Partie supprimée avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        await this.modalSuccessComponent.open();
        this.refreshData();
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la suppression de la partie ' + game.name;
        this.dangerAlertConfig.alertError = error;
        this.dangerAlertConfig.dismissButton = true;
      });
  }

}
