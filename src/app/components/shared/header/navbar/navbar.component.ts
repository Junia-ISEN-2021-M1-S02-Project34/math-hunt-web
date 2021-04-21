import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logged: boolean;

  constructor(private authenticationService: AuthenticationService) {
    authenticationService.getLoggedState.subscribe(logged => this.changedState(logged));
  }

  ngOnInit(): void {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.accessToken){
      this.logged = true;
    }
  }

  onLogout(): void{
    this.authenticationService.signOut();
  }

  changedState(logged): void {
    this.logged = (logged);
  }

}
