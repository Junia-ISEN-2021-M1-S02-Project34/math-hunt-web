import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../shared/modal/success/modal-success.component';
import {ITeam} from '../../interfaces/team.interface';
import {ModalConfig} from '../shared/modal/modal.config';
import {AlertConfig} from '../shared/alert/alert.config';
import {ActivatedRoute, Router} from '@angular/router';
import {TeamService} from '../../services/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  team = {} as ITeam;

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private teamService: TeamService) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams.team){
      this.team._id = this.route.snapshot.queryParams.team;
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
    this.router.navigate(['/games/edit'], { queryParams: { game: this.team.gameId } });
  }

  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */

  refreshData(): void{
    this.loading = true;
    this.dangerAlertConfig = undefined;
    this.teamService.getTeamById(this.team).subscribe((res: ITeam) => {
        this.team = res;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la r??cup??ration de l\'??quipe.';
        this.dangerAlertConfig.alertText = 'La r??cup??ration de l\'??quipes a ??chou??. Le serveur a renvoy?? une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }


  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */

}
