import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../../shared/modal/success/modal-success.component';
import {IGeoGroup} from '../../../interfaces/geoGroup.interface';
import {ModalConfig} from '../../shared/modal/modal.config';
import {AlertConfig} from '../../shared/alert/alert.config';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {EnigmaService} from '../../../services/enigma.service';
import {IEnigma} from '../../../interfaces/enigma.interface';
import {GeoGroupService} from '../../../services/geoGroup.service';
import {IAnswer} from '../../../interfaces/answer.interface';
import {IProposition} from '../../../interfaces/proposition.interface';
import {IHint} from '../../../interfaces/hint.interface';
import {AnswerService} from '../../../services/answer.service';
import {PropositionService} from '../../../services/proposition.service';
import {HintService} from '../../../services/hint.service';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-enigma-new',
  templateUrl: './enigma-new.component.html',
  styleUrls: ['./enigma-new.component.css']
})

export class EnigmaNewComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  geoGroups: IGeoGroup[];
  enigmas: IEnigma[];

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;
  displayEnigmaForm: boolean;
  displayAnswerForm: boolean;
  displayHintForm: boolean;
  myEnigma: IEnigma;
  myAnswer: IAnswer;
  myPropositions: IProposition[];

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
  isLinked: FormControl;
  nextEnigmaId: FormControl;
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


  constructor(private enigmaService: EnigmaService,
              private answerService: AnswerService,
              private propositionService: PropositionService,
              private hintService: HintService,
              private geoGroupService: GeoGroupService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.refreshData();
    this.createFormControls();
    this.createForm();
    this.displayEnigmaForm = true;
  }

  /******************************************** */
  /************      Forms          *************/
  /******************************************** */

  createFormControls(): void {
    this.name = new FormControl(null, Validators.required);
    this.description = new FormControl(null, Validators.required);
    this.pictureUrl = new FormControl(null);
    this.question = new FormControl(null, Validators.required);
    this.positionX = new FormControl(null, Validators.required);
    this.positionY = new FormControl(null, Validators.required);
    this.scoreValue = new FormControl(null, Validators.required);
    this.geoGroupId = new FormControl('', Validators.required);
    this.nextEnigmaId = new FormControl('', Validators.required);
    this.solution = new FormControl(null, Validators.required);
    this.attemptsNumber = new FormControl(null, Validators.required);
    this.isActive = new FormControl(true);
    this.isLinked = new FormControl(false);
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
      nextEnigmaId: this.nextEnigmaId,
      isActive: this.isActive,
      isLinked: this.isLinked,
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
  }

  get fPropositions(): { [p: string]: AbstractControl } { return this.answerForm.controls; }
  get tPropositions(): FormArray { return this.fPropositions.propositions as FormArray; }

  get fHints(): { [p: string]: AbstractControl } { return this.hintsForm.controls; }
  get tHints(): FormArray { return this.fHints.hints as FormArray; }


  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

  onButtonBack(): void {
    this.router.navigate(['/enigmas']);
  }

  onSubmitEnigmaForm(): void{
    this.enigmaFormSubmitted = true;
    this.dangerAlertConfig = undefined;
    if (!this.isLinked.value){
      this.enigmaForm.removeControl('nextEnigmaId');
      this.enigmaForm.addControl('nextEnigmaId', new FormControl(null));
    }
    else {
      this.enigmaForm.addControl('nextEnigmaId', new FormControl(null, Validators.required));
    }
    if (this.enigmaForm.valid) {
      this.postEnigma();
      this.enigmaFormSubmitted = false;
    }
  }

  onSubmitAnswerForm(): void{
    this.answerFormSubmitted = true;
    this.dangerAlertConfig = undefined;
    if (this.answerForm.valid) {
      this.postAnswer();
      this.answerFormSubmitted = false;
    }
  }

  onSubmitHintForm(): void{
    this.hintsFormSubmitted = true;
    this.dangerAlertConfig = undefined;
    if (this.hintsForm.valid) {
      this.postHints();
      this.hintsFormSubmitted = false;
    }
  }

  onIsMcqToggle(): void {
    if (this.isMcq.value && this.tPropositions.length < 1){
      this.onPropositionAdd();
    }
    else if (!this.isMcq.value){
      this.tPropositions.clear();
    }
  }

  onPropositionAdd(): void {
    this.tPropositions.push(this.formBuilder.group({
      text: [null, Validators.required],
    }));
  }

  onPropositionDelete(index): void {
    if (this.tPropositions.length > 1){
      this.tPropositions.removeAt(index);
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

  onHintDelete(index): void {
    if (this.tHints.length > 0){
      this.tHints.removeAt(index);
    }
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
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la récupération des geogroups.';
        this.dangerAlertConfig.alertText = 'La récupération des geogroups a échoué. Le serveur a renvoyé une erreur. Veuillez rafraichir la page.';
        this.dangerAlertConfig.alertError = error.message;
        this.dangerAlertConfig.refreshButton = true;
      });
    this.enigmaService.getEnigmas().subscribe((res: IEnigma[]) => {
        this.enigmas = res;
        this.loading = false;
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

  postEnigma(): void{
    // get enigma values
    this.loading = true;
    const enigmaToAdd = this.enigmaForm.value as IEnigma;
    this.enigmaService.postEnigma(enigmaToAdd).subscribe(async (enigma) => {
        this.loading = false;
        this.myEnigma = enigma;
        this.successModalConfig.modalText = 'Enigme ajoutée avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        this.enigmaForm.reset();
        this.displayEnigmaForm = false;
        this.displayAnswerForm = true;
        await this.modalSuccessComponent.open();
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de l\'ajout de l\'énigme';
        this.dangerAlertConfig.alertText = 'L\'énigme que vous essayez d\'ajouter existe peut-être déjà, ou il est invalide.';
        this.dangerAlertConfig.dismissButton = true;
        this.dangerAlertConfig.alertError = error.message;
      });
  }

  postAnswer(): void{
    // get answer values
    this.loading = true;
    const answerToAdd = {} as IAnswer;
    answerToAdd.solution = this.answerForm.value.solution;
    answerToAdd.attemptsNumber = this.answerForm.value.attemptsNumber;
    answerToAdd.isMcq = this.answerForm.value.isMcq;
    answerToAdd.enigmaId = this.myEnigma._id;
    this.answerService.postAnswer(answerToAdd).subscribe(async (answer) => {
        this.myAnswer = answer;

        if (this.myAnswer.isMcq) {
          const propositionsRequests = [];
          for (const p of this.answerForm.value.propositions) {
            p.answerId = this.myAnswer._id;
            propositionsRequests.push(this.propositionService.postProposition(p).pipe(map((res) => res)));
          }
          // post propositions
          forkJoin(
            propositionsRequests
          ).subscribe(async (propositions: IProposition[]) => {
            this.loading = false;
            this.myPropositions = propositions;
            this.successModalConfig.modalText = 'Réponse ajoutée avec succès !';
            this.successModalConfig.closeAfterXSeconds = 3;
            this.answerForm.reset();
            this.displayAnswerForm = false;
            this.displayHintForm = true;
            await this.modalSuccessComponent.open();
          });
        }
        else {
          this.loading = false;
          this.successModalConfig.modalText = 'Réponse ajoutée avec succès !';
          this.successModalConfig.closeAfterXSeconds = 3;
          this.answerForm.reset();
          this.displayAnswerForm = false;
          this.displayHintForm = true;
          await this.modalSuccessComponent.open();
        }
      },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de l\'ajout de la réponse';
        this.dangerAlertConfig.alertText = 'La réponse que vous essayez d\'ajouter existe peut-être déjà, ou est invalide.';
        this.dangerAlertConfig.dismissButton = true;
        this.dangerAlertConfig.alertError = error.message;
      });
  }

  postHints(): void{
    // get hints values
    this.loading = true;
    const hintsToAdd = this.hintsForm.value.hints as IHint[];
    const hintsRequests = [];
    for (const h of hintsToAdd){
      h.enigmaId = this.myEnigma._id;
      if (!this.myAnswer.isMcq && h.propositionToRemove === ''){
        h.propositionToRemove = undefined;
      }
      hintsRequests.push(this.hintService.postHint(h).pipe(map((res) => res)));
    }
    console.log(hintsToAdd);
    forkJoin(
      hintsRequests
    ).subscribe(async (hints) => {
      this.loading = false;
      this.successModalConfig.modalText = 'Indices ajoutés avec succès !';
      this.successModalConfig.closeAfterXSeconds = 3;
      await this.modalSuccessComponent.open().then(() => {
        this.router.navigate(['/enigmas/edit'], { queryParams: { enigma: this.myEnigma._id } });
      });
    },
      error => {
        this.loading = false;
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de l\'ajout des indices';
        this.dangerAlertConfig.alertText = 'Les indices que vous essayez d\'ajouter existent peut-être déjà, ou est invalide.';
        this.dangerAlertConfig.dismissButton = true;
        this.dangerAlertConfig.alertError = error.message;
      });
  }
}
