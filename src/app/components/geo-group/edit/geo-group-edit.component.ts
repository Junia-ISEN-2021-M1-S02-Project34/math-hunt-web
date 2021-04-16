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
import {circle, featureGroup, FeatureGroup, icon, latLng, Marker, marker, polygon, tileLayer} from 'leaflet';

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
  radius: FormControl;
  pictureUrl: FormControl;
  submitted = false;

  // map
  layers = [];
  options;

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

  initMap(): void{
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '...' }),
      ],
      zoom: 15,
      center: latLng(this.geoGroup.positionX, this.geoGroup.positionY)
    };
    this.layers[0] = marker([ this.geoGroup.positionX, this.geoGroup.positionY ], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });
    this.layers[1] = circle([ this.geoGroup.positionX, this.geoGroup.positionY ], { radius: this.editGeoGroupForm.value.radius });
  }




  /******************************************** */
  /************      Forms          *************/
  /******************************************** */

  createFormControls(): void {
    this.name = new FormControl(null, Validators.required);
    this.radius = new FormControl(null, Validators.required);
    this.pictureUrl = new FormControl(null, Validators.required);
  }

  createForms(): void {
    this.editGeoGroupForm = new FormGroup({
      name: this.name,
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

  onMapMouseClick(event): void{
    this.geoGroup.positionX = event.latlng.lat;
    this.geoGroup.positionY = event.latlng.lng;
    this.layers[0] = marker([ this.geoGroup.positionX, this.geoGroup.positionY ], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });
    this.layers[1] = circle([ this.geoGroup.positionX, this.geoGroup.positionY ], { radius: this.editGeoGroupForm.value.radius });
  }

  onRadiusChange(): void {
    this.layers[1] = circle([ this.geoGroup.positionX, this.geoGroup.positionY ], { radius: this.editGeoGroupForm.value.radius });
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
        this.initMap();
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
