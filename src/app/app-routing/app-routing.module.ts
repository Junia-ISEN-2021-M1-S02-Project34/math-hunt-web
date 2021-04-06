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
//canActivate: [AuthGuard
const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {path: 'geoGroups', component: GeoGroupComponent},
  {path: 'geoGroups/edit', component: GeoGroupEditComponent},
  {path: 'enigmas', component: EnigmaComponent},
  {path: 'enigmas/new', component: EnigmaNewComponent},
  {path: 'enigmas/edit', component: EnigmaEditComponent},
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
