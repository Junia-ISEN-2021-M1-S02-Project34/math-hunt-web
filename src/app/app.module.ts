import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing/app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/shared/header/navbar/navbar.component';
import {HomeComponent} from './components/home/home.component';
import {FourOFourComponent} from './components/shared/four-o-four/four-o-four.component';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {AlertDangerComponent} from './components/shared/alert/danger/alert-danger.component';
import {AlertWarningComponent} from './components/shared/alert/warning/alert-warning.component';
import {SignInComponent} from './components/shared/sign-in/sign-in.component';
import {ModalSuccessComponent} from './components/shared/modal/success/modal-success.component';
import {ModalDangerComponent} from './components/shared/modal/danger/modal-danger.component';
import {ModalWarningComponent} from './components/shared/modal/warning/modal-warning.component';
import {ModalInfoComponent} from './components/shared/modal/info/modal-info.component';
import {SignUpComponent} from './components/shared/sign-up/sign-up.component';
import {GeoGroupComponent} from './components/geo-group/geo-group.component';
import {ReactiveFormsModule} from '@angular/forms';
import {GeoGroupEditComponent} from './components/geo-group/edit/geo-group-edit.component';
import {EnigmaComponent} from './components/enigma/enigma.component';
import {EnigmaEditComponent} from './components/enigma/edit/enigma-edit.component';
import {EnigmaNewComponent} from './components/enigma/new/enigma-new.component';
import {SortablejsModule} from 'ngx-sortablejs';
import {GameComponent} from './components/game/game.component';
import {GameNewComponent} from './components/game/new/game-new.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {GameEditComponent} from './components/game/edit/game-edit.component';
import {TeamComponent} from './components/team/team.component';
import {LeaderboardComponent} from './components/game/leaderboard/leaderboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FourOFourComponent,
    AlertDangerComponent,
    AlertWarningComponent,
    ModalSuccessComponent,
    SignInComponent,
    ModalDangerComponent,
    ModalWarningComponent,
    ModalInfoComponent,
    SignUpComponent,
    GeoGroupComponent,
    GeoGroupEditComponent,
    EnigmaComponent,
    EnigmaEditComponent,
    EnigmaNewComponent,
    GameComponent,
    GameNewComponent,
    GameEditComponent,
    TeamComponent,
    LeaderboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SortablejsModule.forRoot({ animation: 150 }),
    LeafletModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
