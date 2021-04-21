import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../services/authentication.service';
import {JwtUser} from '../../../../interfaces/jwt-user.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logged: boolean;
  currentUser: JwtUser;

  constructor(private authenticationService: AuthenticationService) {
    authenticationService.getLoggedState.subscribe(logged => this.changedState(logged));
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser.accessToken){
      this.logged = true;
    }
  }

  onLogout(): void{
    this.authenticationService.signOut();
  }

  changedState(logged): void {
    this.logged = (logged);
    this.currentUser = this.authenticationService.currentUserValue;
  }

}
