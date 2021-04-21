import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDangerComponent} from '../shared/modal/danger/modal-danger.component';
import {ModalSuccessComponent} from '../shared/modal/success/modal-success.component';
import {ModalConfig} from '../shared/modal/modal.config';
import {AlertConfig} from '../shared/alert/alert.config';
import {AuthenticationService} from '../../services/authentication.service';
import {JwtUser} from '../../interfaces/jwt-user.interface';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @ViewChild('dangerModal') private modalDangerComponent: ModalDangerComponent;
  @ViewChild('successModal') private modalSuccessComponent: ModalSuccessComponent;

  admin: JwtUser;

  // alert & modal
  dangerModalConfig = {} as ModalConfig;
  successModalConfig = {} as ModalConfig;
  dangerAlertConfig: AlertConfig;

  loading: boolean;

  // form
  editPasswordForm: FormGroup;
  password: FormControl;
  submitted = false;


  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.admin = this.authenticationService.currentUserValue;
    this.createFormControls();
    this.createForm();
  }

  createFormControls(): void {
    this.password = new FormControl(null, [Validators.required, Validators.minLength(8)]);
  }

  createForm(): void {
    this.editPasswordForm = new FormGroup({
      password: this.password
    });
  }


  /******************************************** */
  /************   Buttons Actions   *************/
  /******************************************** */

  async onSubmitEditForm(): Promise<void> {
    this.submitted = true;
    this.dangerAlertConfig = undefined;
    if (this.editPasswordForm.valid) {
      this.dangerAlertConfig = undefined;
      this.dangerModalConfig.modalTitle = 'Confirmer la modification.';
      this.dangerModalConfig.modalText = `Voulez-vous vraiment modifier le mot de passe ?`;
      this.dangerModalConfig.actionButtonLabel = 'Oui';
      this.dangerModalConfig.dismissButtonLabel = 'Annuler';
      await this.modalDangerComponent.open().then((r) => {
        if (r === 'Oui') {
          this.updatePassword();
        }
      });
      this.submitted = false;
    }
  }



  /******************************************** */
  /************    Data fetcher     *************/
  /******************************************** */



  /******************************************** */
  /************  Forms treatment    *************/
  /******************************************** */

  updatePassword(): void{
    this.loading = true;
    this.authenticationService.updatePassword(this.admin.username, this.editPasswordForm.value.password).subscribe(async () => {
        this.successModalConfig.modalText = 'Mot de passe modifié avec succès !';
        this.successModalConfig.closeAfterXSeconds = 3;
        await this.modalSuccessComponent.open();
        this.loading = false;
      },
      error => {
        this.dangerAlertConfig = {} as AlertConfig;
        this.dangerAlertConfig.alertTitle = 'Erreur lors de la modification du mot de passe.';
        this.dangerAlertConfig.alertError = error;
        this.dangerAlertConfig.dismissButton = true;
      });
  }

}
