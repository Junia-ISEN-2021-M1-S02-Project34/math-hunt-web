import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../../shared/modal/success/modal-success.component';
import {ModalConfig} from '../../shared/modal/modal.config';
import {AlertConfig} from '../../shared/alert/alert.config';
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

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private gameService: GameService,
              private teamService: TeamService) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams.game){
      this.game._id = this.route.snapshot.queryParams.game;
      this.fetchInfos();
      this.refreshData();
    }
    else {
      this.router.navigate(['/games']);
    }
  }


  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

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

  onButtonSeeTeam(team): void {
    this.router.navigate(['/team'], { queryParams: { team: team._id } });
  }

  async onButtonStart(): Promise<void> {
    this.dangerAlertConfig = undefined;
    this.dangerModalConfig.modalTitle = 'Confirmer le lancement ?';
    this.dangerModalConfig.modalText = 'Voulez-vous vraiment débuter la partie ?';
    this.dangerModalConfig.actionButtonLabel = 'Oui';
    this.dangerModalConfig.dismissButtonLabel = 'Annuler';
    await this.modalDangerComponent.open().then((r) => {
      if (r === 'Oui') {
        this.startGame();
      }
    });
  }

  async onButtonStop(): Promise<void> {
    this.dangerAlertConfig = undefined;
    this.dangerModalConfig.modalTitle = 'Confirmer l\'arrêt ?';
    this.dangerModalConfig.modalText = 'Voulez-vous vraiment arrêter la partie ?';
    this.dangerModalConfig.actionButtonLabel = 'Oui';
    this.dangerModalConfig.dismissButtonLabel = 'Annuler';
    await this.modalDangerComponent.open().then((r) => {
      if (r === 'Oui') {
        this.stopGame();
      }
    });
  }

  onButtonAddTeam(): void {
    this.loading = true;
    this.dangerAlertConfig = undefined;
    this.teamService.postTeams({gameId: this.game._id, gameName: this.game.name, numberOfTeams: 1}).subscribe(() => {
        this.refreshData();
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de l\'ajout d\'une équipe.';
        this.dangerAlertConfig.alertText = 'L\'ajout de l\'équipes a échoué. Le serveur a renvoyé une erreur. Veuillez ressayer.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.dismissButton = true;
      });
  }

  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */

  refreshData(): void{
    this.loading = true;
    this.dangerAlertConfig = undefined;
    this.teamService.getTeamByGameId(this.game).subscribe((res: ITeam[]) => {
        this.teams = res;
        this.loading = false;
      },
      error => {
        this.loading = false;
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

  startGame(): void{
    this.loading = true;
    this.gameService.startGame(this.game).subscribe(() => {
        this.loading = false;
        this.fetchInfos();
        this.refreshData();
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors du lancement de la partie.';
        this.dangerAlertConfig.alertText = 'Le lancement de la partie a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }
  stopGame(): void{
    this.loading = true;
    this.gameService.stopGame(this.game).subscribe(() => {
        this.loading = false;
        this.fetchInfos();
        this.refreshData();
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de l\'arrêt de la partie.';
        this.dangerAlertConfig.alertText = 'L\'arrêt de la partie a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
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


}
