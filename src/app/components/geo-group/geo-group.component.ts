import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../shared/modal/success/modal-success.component';
import {IGeoGroup} from '../../interfaces/geoGroup.interface';
import {ModalConfig} from '../shared/modal/modal.config';
import {AlertConfig} from '../shared/alert/alert.config';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {GeoGroupService} from '../../services/geoGroup.service';

@Component({
  selector: 'app-geo-group',
  templateUrl: './geo-group.component.html',
  styleUrls: ['./geo-group.component.css']
})
export class GeoGroupComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  geoGroups: IGeoGroup[];

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  // form
  displayNewGeoGroupForm: boolean;
  addGeoGroupForm: FormGroup;
  name: FormControl;
  positionX: FormControl;
  positionY: FormControl;
  radius: FormControl;
  pictureUrl: FormControl;
  submitted = false;


  constructor(private geoGroupService: GeoGroupService,
              private router: Router) { }

  ngOnInit(): void {
    this.refreshData();
    this.createFormControls();
    this.createForm();
  }

  /******************************************** */
  /************      Forms          *************/
  /******************************************** */

  createFormControls(): void {
    this.name = new FormControl(null, Validators.required);
    this.positionX = new FormControl(null, Validators.required);
    this.positionY = new FormControl(null, Validators.required);
    this.radius = new FormControl(null, Validators.required);
    this.pictureUrl = new FormControl(null, Validators.required);
  }

  createForm(): void {
    this.addGeoGroupForm = new FormGroup({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      radius: this.radius,
      pictureUrl: this.pictureUrl
    });
  }


  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

  onButtonEdit(geoGroup): void {
    this.router.navigate(['/geoGroups/edit'], { queryParams: { geoGroup: geoGroup._id } });
  }

  onButtonNew(): void{
    this.displayNewGeoGroupForm = true;
  }

  onSubmitAddForm(): void{
    this.submitted = true;
    this.dangerAlertConfig = undefined;
    if (this.addGeoGroupForm.valid) {
      this.postGeoGroup();
      this.submitted = false;
    }
  }

  async onButtonDelete(geoGroup): Promise<void> {
    this.dangerAlertConfig = undefined;
    this.dangerModalConfig.modalTitle = 'Confirmer la supression ?';
    this.dangerModalConfig.modalText = `Voulez-vous vraiment supprimer le GeoGroup ${geoGroup.name} ?`;
    this.dangerModalConfig.actionButtonLabel = 'Oui';
    this.dangerModalConfig.dismissButtonLabel = 'Annuler';
    await this.modalDangerComponent.open().then((r) => {
      if (r === 'Oui') {
        this.deleteGeoGroup(geoGroup);
      }
    });
  }



  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */

  refreshData(): void{
    this.dangerAlertConfig = undefined;
    this.geoGroupService.getGeoGroups().subscribe((res: IGeoGroup[]) => {
        this.geoGroups = res;
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération des geogroups.';
        this.dangerAlertConfig.alertText = 'La récupération des geogroups a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }



  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */

  deleteGeoGroup(geoGroup): void{
    this.geoGroupService.deleteGeoGroup(geoGroup).subscribe(async () => {
        this.successModalConfig.modalText = 'GeoGroup supprimé avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        await this.modalSuccessComponent.open().then(() => {
          this.refreshData();
        });
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la suppression du GeoGroup ' + geoGroup.name;
        this.dangerAlertConfig.alertError = error;
        this.dangerAlertConfig.dismissButton = true;
      });
  }


  postGeoGroup(): void{
    const toAdd = this.addGeoGroupForm.value as IGeoGroup;
    this.geoGroupService.postGeoGroup(toAdd).subscribe(async () => {
        this.successModalConfig.modalText = 'GeoGroup ajouté avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        this.addGeoGroupForm.reset();
        this.displayNewGeoGroupForm = false;
        this.refreshData();
        await this.modalSuccessComponent.open();
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de l\'ajout du GeoGroup';
        this.dangerAlertConfig.alertText = 'Le GeoGroup que vous essayez d\'ajouter existe peut-être déjà, ou il est invalide.';
        this.dangerAlertConfig.dismissButton = true;
      });
  }

}
