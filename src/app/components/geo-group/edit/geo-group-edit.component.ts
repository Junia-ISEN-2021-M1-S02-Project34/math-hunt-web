import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../../shared/modal/success/modal-success.component';
import {IGeoGroup} from '../../../interfaces/geoGroup.interface';
import {IEnigma} from '../../../interfaces/enigma.interface';
import {ModalConfig} from '../../shared/modal/modal.config';
import {AlertConfig} from '../../shared/alert/alert.config';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EnigmaService} from '../../../services/enigma.service';
import {GeoGroupService} from '../../../services/geoGroup.service';
import {SortableOptions} from 'sortablejs';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {IProposition} from '../../../interfaces/proposition.interface';

@Component({
  selector: 'app-geo-group-edit',
  templateUrl: './geo-group-edit.component.html',
  styleUrls: ['./geo-group-edit.component.css']
})
export class GeoGroupEditComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  geoGroup = {} as IGeoGroup;
  enigmas: IEnigma[];

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
  editGeoGroupForm: FormGroup;
  name: FormControl;
  positionX: FormControl;
  positionY: FormControl;
  radius: FormControl;
  pictureUrl: FormControl;
  submitted = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private enigmaService: EnigmaService,
              private geoGroupService: GeoGroupService) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams.geoGroup){
      this.geoGroup._id = this.route.snapshot.queryParams.geoGroup;
      this.fetchInfos();
      this.refreshData();
      this.createFormControls();
      this.createForms();
      this.sortOptions = {
        onUpdate: (event: any) => {
          this.updateEnigmasOrder();
        }
      };
    }
    else {
      this.router.navigate(['/geoGroups']);
    }
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

  createForms(): void {
    this.editGeoGroupForm = new FormGroup({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      radius: this.radius,
      pictureUrl: this.pictureUrl,
    });
  }





  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

  onSubmitEditForm(): void{
    this.submitted = true;
    this.dangerAlertConfig = undefined;
    if (this.editGeoGroupForm.valid) {
      this.editGeoGroup();
      this.editGeoGroupForm.reset();
      this.submitted = false;
    }
  }

  onButtonBack(): void {
    this.router.navigate(['/geoGroups']);
  }

  onButtonEnigma(enigma): void {
    this.router.navigate(['/enigmas/edit'], { queryParams: { enigma: enigma._id } });
  }

  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */

  refreshData(): void{
    this.loadingInTab = true;
    this.dangerAlertConfig = undefined;
    this.enigmaService.getEnigmasByGeoGroupId(this.geoGroup).subscribe((res: IEnigma[]) => {
        this.enigmas = res;
        this.loadingInTab = false;
      },
      error => {
        this.loadingInTab = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération des énigmes.';
        this.dangerAlertConfig.alertText = 'La récupération des énigmes a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }

  fetchInfos(): void{
    this.loading = true;
    this.geoGroupService.getGeoGroupById(this.geoGroup).subscribe((res: IGeoGroup) => {
        this.geoGroup = res;
        this.editGeoGroupForm.patchValue(this.geoGroup);
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération des infos du GeoGroup.';
        this.dangerAlertConfig.alertText = 'La récupération du GeoGroup a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }





  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */
  editGeoGroup(): void{
    const toEdit = this.editGeoGroupForm.value as IGeoGroup;
    toEdit._id = this.geoGroup._id;
    this.geoGroupService.putGeoGroup(toEdit).subscribe(async () => {
        this.successModalConfig.modalText = 'GeoGroup modifiée avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        this.editGeoGroupForm.reset();
        this.displayEditForm = false;
        this.fetchInfos();
        await this.modalSuccessComponent.open();
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la modification du GeoGroup';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.dismissButton = true;
      });
  }

  updateEnigmasOrder(): void{
    this.loadingInTab = true;
    const requests = [];
    for (const [index, value] of this.enigmas.entries()){
      value.order = index + 1;
      requests.push(this.enigmaService.putEnigma(value).pipe(map((res) => res)));
    }
    forkJoin(
      requests
    ).subscribe(async (enigmas: IEnigma[]) => {
      this.refreshData();
    },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la modification de l\'ordre des énigmes';
        this.dangerAlertConfig.alertText = 'Veuillez réessayer.';
        this.dangerAlertConfig.dismissButton = true;
        this.dangerAlertConfig.alertError = error.message;
      });
  }

}
