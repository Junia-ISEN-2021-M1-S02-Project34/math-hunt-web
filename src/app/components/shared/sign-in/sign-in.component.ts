import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AlertConfig} from '../alert/alert.config';
import {AuthenticationService} from '../../../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loading: boolean;
  returnUrl: string;
  warningAlertConfig: AlertConfig;
  destinationPageMessage: string;

  // form
  authForm: FormGroup;
  username: FormControl;
  password: FormControl;
  submitted: boolean;

  constructor(private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.createFormControls();
    this.createForms();
  }

  createFormControls(): void {
    this.username = new FormControl(null, Validators.required);
    this.password = new FormControl(null,  Validators.required);
  }

  createForms(): void {
    this.authForm = new FormGroup({
      username: this.username,
      password: this.password
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.authForm.valid) {
      this.warningAlertConfig = undefined;
      this.loading = true;
      this.authenticationService.signIn(this.authForm.value.username, this.authForm.value.password)
        .pipe(first())
        .subscribe(
          (data) => {
            this.router.navigate([this.returnUrl]);
          },
          (error) => {
            this.warningAlertConfig = {} as AlertConfig;
            this.warningAlertConfig.dismissButton = true;
            if (error.status === 401 || error.status === 404){
              this.warningAlertConfig.alertTitle = 'Identifiant ou mot de passe incorrect.';
              this.warningAlertConfig.alertError = undefined;
            }
            else {
              this.warningAlertConfig.alertTitle = 'Erreur lors de la communication avec le serveur.';
              this.warningAlertConfig.alertError = error.message;
            }
            this.warningAlertConfig.alertText = 'Veuillez verifier votre saisie. Si l\'erreur persiste, contcatez l\'administrateur.';
            this.loading = false;
          }
        );
    }
  }

}
