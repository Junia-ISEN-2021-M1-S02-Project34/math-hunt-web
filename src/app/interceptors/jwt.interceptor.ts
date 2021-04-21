import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // add authorization header with jwt token if available
    const currentUser = this.authenticationService.currentUserValue;

    // user auth
    if (currentUser && currentUser.accessToken) {
      request = request.clone({
        setHeaders: {
          'x-access-token': currentUser.accessToken
        }
      });
    }


    return next.handle(request);
  }
}
