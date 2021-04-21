import {EventEmitter, Injectable, Output} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtUser} from '../interfaces/jwt-user.interface';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  @Output() getLoggedState: EventEmitter<boolean> = new EventEmitter();
  private apiUrl = `${environment.apiHostname}/auth`;

  // user auth
  private currentUserSubject: BehaviorSubject<JwtUser>;
  public currentUser: Observable<JwtUser>;

  constructor(private http: HttpClient,
              private router: Router,) {
    this.currentUserSubject = new BehaviorSubject<JwtUser>(JSON.parse(localStorage.getItem('user') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): JwtUser {
    return this.currentUserSubject.value;
  }

  // signIn API with username and password
  signIn(username: string, password: string): Observable<unknown>{
    return this.http.post<any>(`${this.apiUrl}/sign-in/admin`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.getLoggedState.emit(true);
        return user;
      }));
  }

  signOut(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.currentUserSubject = new BehaviorSubject<JwtUser>({accessToken: '', username: ''});
    this.getLoggedState.emit(false);
    this.router.navigate(['/sign-in']);
  }
}
