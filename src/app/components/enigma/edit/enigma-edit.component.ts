import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../../shared/modal/success/modal-success.component';
import {IGeoGroup} from '../../../interfaces/geoGroup.interface';
import {IEnigma, IFullEnigma} from '../../../interfaces/enigma.interface';
import {ModalConfig} from '../../shared/modal/modal.config';
import {AlertConfig} from '../../shared/alert/alert.config';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EnigmaService} from '../../../services/enigma.service';
import {GeoGroupService} from '../../../services/geoGroup.service';
import {IAnswer} from '../../../interfaces/answer.interface';
import {IProposition} from '../../../interfaces/proposition.interface';
import {AnswerService} from '../../../services/answer.service';
import {PropositionService} from '../../../services/proposition.service';
import {HintService} from '../../../services/hint.service';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {IHint} from '../../../interfaces/hint.interface';
import {icon, latLng, marker, tileLayer} from 'leaflet';

@Component({
  selector: 'app-enigma-edit',
  templateUrl: './enigma-edit.component.html',
  styleUrls: ['./enigma-edit.component.css']
})
export class EnigmaEditComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  geoGroups: IGeoGroup[];

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;
  myEnigma: IEnigma;
  myAnswer: IAnswer;
  myPropositions: IProposition[];
  myHints: IHint[];

  // form
  // enigma form
  enigmaForm: FormGroup;
  name: FormControl;
  description: FormControl;
  pictureUrl: FormControl;
  question: FormControl;
  positionX: FormControl;
  positionY: FormControl;
  scoreValue: FormControl;
  geoGroupId: FormControl;
  isActive: FormControl;
  order: FormControl;
  enigmaFormSubmitted = false;
  // answer form
  answerForm: FormGroup;
  solution: FormControl;
  attemptsNumber: FormControl;
  isMcq: FormControl;
  propositions: FormArray;
  answerFormSubmitted = false;
  // hints form
  hintsForm: FormGroup;
  hints: FormArray;
  hintsFormSubmitted = false;

  // map
  layers = [];
  options;
  center;
  zoom = 15;
  showMap: boolean;


  constructor(private enigmaService: EnigmaService,
              private answerService: AnswerService,
              private propositionService: PropositionService,
              private hintService: HintService,
              private geoGroupService: GeoGroupService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams.enigma){
      this.refreshData();
      this.fetchInfos();
      this.createFormControls();
      this.createForm();
    }
    else {
      this.router.navigate(['/enigmas']);
    }
  }

  /******************************************** */
  /************      Forms          *************/
  /******************************************** */

  createFormControls(): void {
    this.name = new FormControl(null, Validators.required);
    this.description = new FormControl(null, Validators.required);
    this.pictureUrl = new FormControl(null);
    this.question = new FormControl(null, Validators.required);
    this.positionX = new FormControl(0);
    this.positionY = new FormControl(0);
    this.scoreValue = new FormControl(null, Validators.required);
    this.geoGroupId = new FormControl('', Validators.required);
    this.order = new FormControl(null, Validators.required);
    this.solution = new FormControl(null, Validators.required);
    this.attemptsNumber = new FormControl(null, Validators.required);
    this.isActive = new FormControl(true);
    this.isMcq = new FormControl(false);
    this.propositions = new FormArray([]);
    this.hints = new FormArray([]);
  }

  createForm(): void {
    this.enigmaForm = new FormGroup({
      name: this.name,
      description: this.description,
      pictureUrl: this.pictureUrl,
      question: this.question,
      positionX: this.positionX,
      positionY: this.positionY,
      scoreValue: this.scoreValue,
      geoGroupId: this.geoGroupId,
      order: this.order,
      isActive: this.isActive,
    });
    this.answerForm = new FormGroup({
      solution: this.solution,
      attemptsNumber: this.attemptsNumber,
      propositions: this.propositions,
      isMcq: this.isMcq,
    });
    this.hintsForm = new FormGroup({
      hints: this.hints,
    });
    this.initMap();
  }

  get fPropositions(): { [p: string]: AbstractControl } { return this.answerForm.controls; }
  get tPropositions(): FormArray { return this.fPropositions.propositions as FormArray; }

  get fHints(): { [p: string]: AbstractControl } { return this.hintsForm.controls; }
  get tHints(): FormArray { return this.fHints.hints as FormArray; }

  initMap(): void{
    this.showMap = false;
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '...' }),
      ]
    };
    this.updateMap();
  }

  updateMap(): void{
    this.center = latLng(this.positionX.value, this.positionY.value);
    this.layers[0] = marker([ this.positionX.value, this.positionY.value ], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });
  }

  onCollapse(): void{
    this.showMap = !this.showMap;
  }


  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

  onButtonBack(): void {
    this.router.navigate(['/enigmas']);
  }

  onSubmitEnigmaForm(): void{
    this.enigmaFormSubmitted = true;
    this.dangerAlertConfig = undefined;
    if (this.enigmaForm.valid) {
      this.putEnigma();
      this.enigmaFormSubmitted = false;
    }
  }

  onSubmitAnswerForm(): void{
    this.answerFormSubmitted = true;
    this.dangerAlertConfig = undefined;
    if (this.answerForm.valid) {
      this.putAnswer();
      this.answerFormSubmitted = false;
    }
  }

  onSubmitHintForm(): void{
    this.hintsFormSubmitted = true;
    this.dangerAlertConfig = undefined;
    console.log(this.hintsForm.value.hints);
    if (this.hintsForm.valid) {
      this.putHints();
      this.hintsFormSubmitted = false;
    }
  }

  async onIsMcqToggle(): Promise<void> {
    if (this.isMcq.value) {
      this.onPropositionAdd();
    } else {
      this.dangerAlertConfig = undefined;
      this.dangerModalConfig.modalTitle = 'Confirmer la supression ?';
      this.dangerModalConfig.modalText = `Voulez-vous vraiment supprimer les propositions ?`;
      this.dangerModalConfig.actionButtonLabel = 'Oui';
      this.dangerModalConfig.dismissButtonLabel = 'Annuler';
      await this.modalDangerComponent.open().then((r) => {
        if (r === 'Oui') {
          this.tPropositions.clear();
        }
        else {
          this.isMcq.patchValue(true);
        }
      });
    }
  }

  onPropositionAdd(): void {
    this.tPropositions.push(this.formBuilder.group({
      text: [null, Validators.required],
    }));
  }

  async onPropositionDelete(proposition: IProposition, index): Promise<void> {
    if (this.tPropositions.length > 1) {
      if (proposition._id) {
        this.dangerAlertConfig = undefined;
        this.dangerModalConfig.modalTitle = 'Confirmer la supression ?';
        this.dangerModalConfig.modalText = `Voulez-vous vraiment supprimer la proposition ${proposition.text} ?`;
        this.dangerModalConfig.actionButtonLabel = 'Oui';
        this.dangerModalConfig.dismissButtonLabel = 'Annuler';
        await this.modalDangerComponent.open().then((r) => {
          if (r === 'Oui') {
            this.deleteProposition(proposition);
          }
        });
      } else {
        this.tPropositions.removeAt(index);
      }
    }
  }

  onHintAdd(): void {
    this.tHints.push(this.formBuilder.group({
      name: [null, Validators.required],
      text: [null, Validators.required],
      rank: [null, Validators.required],
      penalty: [null, Validators.required],
      propositionToRemove: ['']
    }));
  }

  async onHintDelete(hint: IHint, index): Promise<void> {
    if (this.tHints.length > 0) {
      if (hint._id) {
        this.dangerAlertConfig = undefined;
        this.dangerModalConfig.modalTitle = 'Confirmer la supression ?';
        this.dangerModalConfig.modalText = `Voulez-vous vraiment supprimer l'indice ${hint.name} ?`;
        this.dangerModalConfig.actionButtonLabel = 'Oui';
        this.dangerModalConfig.dismissButtonLabel = 'Annuler';
        await this.modalDangerComponent.open().then((r) => {
          if (r === 'Oui') {
            this.deleteHint(hint);
          }
        });
      } else {
        this.tHints.removeAt(index);
      }
    }
  }

  onCancel(): void {
    this.fetchInfos();
  }

  onMapMouseClick(event): void{
    this.positionX.patchValue(event.latlng.lat);
    this.positionY.patchValue(event.latlng.lng);
    this.layers[0] = marker([ this.positionX.value, this.positionY.value ], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });
    this.center = latLng(this.positionX.value, this.positionY.value);
  }


  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */

  refreshData(): void{
    this.loading = true;
    this.dangerAlertConfig = undefined;
    this.geoGroupService.getGeoGroups().subscribe((res: IGeoGroup[]) => {
        this.geoGroups = res;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération des GeoGroups.';
        this.dangerAlertConfig.alertText = 'La récupération des geogroups a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }

  fetchInfos(): void{
    this.showMap = false;
    this.loading = true;
    this.myEnigma = {} as IEnigma;
    this.myEnigma._id = this.route.snapshot.queryParams.enigma;
    this.enigmaService.getFullEnigmaById(this.myEnigma).subscribe((res: IFullEnigma) => {
        this.myEnigma = res.enigma;
        this.myAnswer = res.answer;
        this.myPropositions = res.propositions;
        this.tPropositions.clear();
        for (const p of this.myPropositions){
          this.tPropositions.push(this.formBuilder.group({
            text: [p.text, Validators.required],
            _id: [p._id]
          }));
        }
        this.enigmaForm.patchValue(this.myEnigma);
        this.answerForm.patchValue(this.myAnswer);
        this.hintService.getHintsByEnigmaId(this.myEnigma).subscribe((res2: IHint[]) => {
            this.myHints = res2;
            this.tHints.clear();
            for (const h of this.myHints){
              this.tHints.push(this.formBuilder.group({
                name: [h.name, Validators.required],
                text: [h.text, Validators.required],
                rank: [h.rank, Validators.required],
                penalty: [h.penalty, Validators.required],
                propositionToRemove: [h.propositionToRemove],
                _id: [h._id]
              }));
            }
            this.updateMap();
            this.loading = false;
          });
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération de l\'énigme.';
        this.dangerAlertConfig.alertText = 'La récupération de l\'énigme a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
  }



  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */

  putEnigma(): void{
    // get enigma values
    this.loading = true;
    const enigmaToAdd = this.enigmaForm.value as IEnigma;
    enigmaToAdd._id = this.myEnigma._id;
    this.enigmaService.putEnigma(enigmaToAdd).subscribe(async (enigma) => {
        this.loading = false;
        this.myEnigma = enigma;
        this.successModalConfig.modalText = 'Enigme modifiée avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        await this.modalSuccessComponent.open();
        this.fetchInfos();
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la modification de l\'énigme';
        this.dangerAlertConfig.alertText = 'L\'énigme que vous essayez de modifier existe peut-être déjà, ou est invalide.';
        this.dangerAlertConfig.dismissButton = true;
        this.dangerAlertConfig.alertError = error.message;
      });
  }

  putAnswer(): void{
    // get answer values
    this.loading = true;
    const answerToAdd = {} as IAnswer;
    answerToAdd.solution = this.answerForm.value.solution;
    answerToAdd.attemptsNumber = this.answerForm.value.attemptsNumber;
    answerToAdd.isMcq = this.answerForm.value.isMcq;
    answerToAdd.enigmaId = this.myEnigma._id;
    answerToAdd._id = this.myAnswer._id;
    this.answerService.putAnswer(answerToAdd).subscribe(async (answer) => {
        this.myAnswer = answer;

        if (this.myAnswer.isMcq) {
          const propositionsRequests = [];
          for (const p of this.answerForm.value.propositions) {
            p.answerId = this.myAnswer._id;
            if (p._id){
              propositionsRequests.push(this.propositionService.putProposition(p).pipe(map((res) => res)));
            }
            else {
              propositionsRequests.push(this.propositionService.postProposition(p).pipe(map((res) => res)));
            }
          }
          // post propositions
          forkJoin(
            propositionsRequests
          ).subscribe(async (propositions: IProposition[]) => {
            this.loading = false;
            this.myPropositions = propositions;
            this.successModalConfig.modalText = 'Propositions modifiées avec succès !';
            this.successModalConfig.closeAfterXSeconds = 3;
            this.answerForm.reset();
            await this.modalSuccessComponent.open();
          });
        }
        else {
          this.loading = false;
          this.successModalConfig.modalText = 'Réponse modifiée avec succès !';
          this.successModalConfig.closeAfterXSeconds = 3;
          this.answerForm.reset();
          await this.modalSuccessComponent.open();
        }
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la modification de la réponse';
        this.dangerAlertConfig.alertText = 'La réponse que vous essayez de modifier existe peut-être déjà, ou est invalide.';
        this.dangerAlertConfig.dismissButton = true;
        this.dangerAlertConfig.alertError = error.message;
      });
  }

  putHints(): void{
    // get hints values
    this.loading = true;
    const hintsToAdd = this.hintsForm.value.hints as IHint[];
    const hintsRequests = [];
    for (const h of hintsToAdd){
      h.enigmaId = this.myEnigma._id;
      if (!this.myAnswer.isMcq || h.propositionToRemove === ''){
        h.propositionToRemove = undefined;
      }
      if (h._id){
        hintsRequests.push(this.hintService.putHint(h).pipe(map((res) => res)));
      }
      else {
        hintsRequests.push(this.hintService.postHint(h).pipe(map((res) => res)));
      }
    }
    forkJoin(
      hintsRequests
    ).subscribe(async (hints) => {
        this.loading = false;
        this.successModalConfig.modalText = 'Indices modifiés avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        await this.modalSuccessComponent.open().then(() => {
          this.router.navigate(['/enigmas/edit'], { queryParams: { enigma: this.myEnigma._id } });
        });
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la modification des indices';
        this.dangerAlertConfig.alertText = 'Les indices que vous essayez de modifier existent peut-être déjà, ou sont invalides.';
        this.dangerAlertConfig.dismissButton = true;
        this.dangerAlertConfig.alertError = error.message;
      });
  }

  deleteProposition(proposition): void{
    this.loading = true;
    this.propositionService.deleteProposition(proposition).subscribe(async () => {
        this.loading = false;
        this.successModalConfig.modalText = 'Proposition suprimée avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        await this.modalSuccessComponent.open();
        this.fetchInfos();
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la supression de la proposition';
        this.dangerAlertConfig.dismissButton = true;
        this.dangerAlertConfig.alertError = error.message;
      });
  }

  deleteHint(hint): void{
    this.loading = true;
    this.hintService.deleteHint(hint).subscribe(async () => {
        this.loading = false;
        this.successModalConfig.modalText = 'Indice suprimé avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        await this.modalSuccessComponent.open();
        this.fetchInfos();
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la supression de l\'indice';
        this.dangerAlertConfig.dismissButton = true;
        this.dangerAlertConfig.alertError = error.message;
      });
  }
}
