import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
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
import {LeaderboardComponent} from '../components/game/leaderboard/leaderboard.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', canActivate: [AuthGuard], component: HomeComponent},
  {path: 'geoGroups', canActivate: [AuthGuard], component: GeoGroupComponent},
  {path: 'geoGroups/edit', canActivate: [AuthGuard], component: GeoGroupEditComponent},
  {path: 'enigmas', canActivate: [AuthGuard], component: EnigmaComponent},
  {path: 'enigmas/new', canActivate: [AuthGuard], component: EnigmaNewComponent},
  {path: 'enigmas/edit', canActivate: [AuthGuard], component: EnigmaEditComponent},
  {path: 'games', canActivate: [AuthGuard], component: GameComponent},
  {path: 'games/new', canActivate: [AuthGuard], component: GameNewComponent},
  {path: 'games/edit', canActivate: [AuthGuard], component: GameEditComponent},
  {path: 'games/leaderboard', canActivate: [AuthGuard], component: LeaderboardComponent},
  {path: 'team', canActivate: [AuthGuard], component: TeamComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'not-found', component: FourOFourComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
