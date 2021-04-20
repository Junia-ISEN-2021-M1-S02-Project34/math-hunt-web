import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../../shared/modal/success/modal-success.component';
import {ITeam} from '../../../interfaces/team.interface';
import {ModalConfig} from '../../shared/modal/modal.config';
import {AlertConfig} from '../../shared/alert/alert.config';
import {ActivatedRoute, Router} from '@angular/router';
import {TeamService} from '../../../services/team.service';
import {IGame} from '../../../interfaces/game.interface';
import {GameService} from '../../../services/game.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  teams: ITeam[];
  game = {} as IGame;

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private teamService: TeamService,
              private gameService: GameService) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams.game){
      this.game._id = this.route.snapshot.queryParams.game;
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

  onButtonSeeTeam(team): void {
    this.router.navigate(['/team'], { queryParams: { team: team._id } });
  }

  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */

  refreshData(): void{
    this.loading = true;
    this.dangerAlertConfig = undefined;
    this.gameService.getGameById(this.game).subscribe((res1: IGame) => {
      this.game = res1;
      this.gameService.getRanking(this.game).subscribe((res: ITeam[]) => {
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
    });
  }


  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */

}
