import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../shared/modal/success/modal-success.component';
import {ModalConfig} from '../shared/modal/modal.config';
import {AlertConfig} from '../shared/alert/alert.config';
import {Router} from '@angular/router';
import {IEnigma} from '../../interfaces/enigma.interface';
import {EnigmaService} from '../../services/enigma.service';
import {GeoGroupService} from '../../services/geoGroup.service';
import {IGeoGroup} from '../../interfaces/geoGroup.interface';

@Component({
  selector: 'app-enigma',
  templateUrl: './enigma.component.html',
  styleUrls: ['./enigma.component.css']
})
export class EnigmaComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  enigmas: IEnigma[];
  geoGroups: [{
    _id: string;
    name: string;
    positionX: number;
    positionY: number;
    radius: number;
    pictureUrl: string;
    updatedAt?: Date;
    createdAt?: Date;
    __v?: number;
    enigmas: IEnigma[];
  }];

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;


  constructor(private enigmaService: EnigmaService,
              private geoGroupService: GeoGroupService,
              private router: Router) { }

  ngOnInit(): void {
    this.refreshData();
  }


  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

  onButtonEdit(enigma): void {
    this.router.navigate(['/enigmas/edit'], { queryParams: { enigma: enigma._id } });
  }

  onButtonNew(): void{
    this.router.navigate(['/enigmas/new']);
  }

  async onButtonDelete(enigma): Promise<void> {
    this.dangerAlertConfig = undefined;
    this.dangerModalConfig.modalTitle = 'Confirmer la supression ?';
    this.dangerModalConfig.modalText = `Voulez-vous vraiment supprimer l\'énigme ${enigma.name} ?`;
    this.dangerModalConfig.actionButtonLabel = 'Oui';
    this.dangerModalConfig.dismissButtonLabel = 'Annuler';
    await this.modalDangerComponent.open().then((r) => {
      if (r === 'Oui') {
        this.deleteEnigma(enigma);
      }
    });
  }



  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */

  refreshData(): void{
    this.loading = true;
    this.dangerAlertConfig = undefined;
    this.enigmaService.getEnigmas().subscribe((res: IEnigma[]) => {
        this.enigmas = res;
        this.enigmas.sort((a, b) => (a.geoGroupId > b.geoGroupId) ? 1 : ((b.geoGroupId > a.geoGroupId) ? -1 : 0));
        this.geoGroupService.getGeoGroups().subscribe((res2: IGeoGroup[]) => {
            // @ts-ignore
            this.geoGroups = res2;
            this.enigmas.sort((a, b) => (a.geoGroupId > b.geoGroupId) ? 1 : ((b.geoGroupId > a.geoGroupId) ? -1 : 0));
            for (const g of this.geoGroups){
              g.enigmas = [];
              for (const e of this.enigmas){
                if (e.geoGroupId === g._id){
                  g.enigmas.push(e);
                }
              }
              g.enigmas.sort((a: IEnigma, b: IEnigma) => {
                if (a.order < b.order) { return -1; }
                if (a.order > b.order) { return 1; }
                return 0;
              });
            }
            this.loading = false;
          });
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération des énigmes.';
        this.dangerAlertConfig.alertText = 'La récupération des énigmes a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }



  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */

  deleteEnigma(enigma): void{
    this.enigmaService.deleteEnigma(enigma).subscribe(async () => {
        this.successModalConfig.modalText = 'Enigme supprimé avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        await this.modalSuccessComponent.open();
        this.refreshData();
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la suppression de l\'énigme ' + enigma.name;
        this.dangerAlertConfig.alertError = error;
        this.dangerAlertConfig.dismissButton = true;
      });
  }

}
