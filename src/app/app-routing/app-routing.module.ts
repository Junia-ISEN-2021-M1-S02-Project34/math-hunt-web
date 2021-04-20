import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../components/home/home.component';
import {FourOFourComponent} from '../components/shared/four-o-four/four-o-four.component';
import {SignInComponent} from '../components/shared/sign-in/sign-in.component';
import {SignUpComponent} from '../components/shared/sign-up/sign-up.component';
import {AuthGuard} from './auth.guard';
import {GeoGroupComponent} from '../components/geo-group/geo-group.component';
import {GeoGroupEditComponent} from '../components/geo-group/edit/geo-group-edit.component';
import {EnigmaEditComponent} from '../components/enigma/edit/enigma-edit.component';
import {EnigmaNewComponent} from '../components/enigma/new/enigma-new.component';
import {EnigmaComponent} from '../components/enigma/enigma.component';
import {GameComponent} from '../components/game/game.component';
import {GameNewComponent} from '../components/game/new/game-new.component';
import {GameEditComponent} from '../components/game/edit/game-edit.component';
import {TeamComponent} from '../components/team/team.component';
//canActivate: [AuthGuard
const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {path: 'geoGroups', component: GeoGroupComponent},
  {path: 'geoGroups/edit', component: GeoGroupEditComponent},
  {path: 'enigmas', component: EnigmaComponent},
  {path: 'enigmas/new', component: EnigmaNewComponent},
  {path: 'enigmas/edit', component: EnigmaEditComponent},
  {path: 'games', component: GameComponent},
  {path: 'games/new', component: GameNewComponent},
  {path: 'games/edit', component: GameEditComponent},
  {path: 'team', component: TeamComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'not-found', component: FourOFourComponent},
  {path: '**', redirectTo: 'not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
