import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IHint} from '../interfaces/hint.interface';
import {IEnigma} from '../interfaces/enigma.interface';

@Injectable({
  providedIn: 'root'
})
export class HintService {
  apiUrl = `${environment.apiHostname}/hints`;

  constructor(private http: HttpClient) { }

  postHint(hint: IHint): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/hint`, hint);
  }

  getHints(): Observable<IHint[]> {
    return this.http.get<any>(`${this.apiUrl}/get/hints`).pipe(
      map(res => res.hints)
    );
  }

  getHintById(hint: IHint): Observable<IHint> {
    return this.http.get<any>(`${this.apiUrl}/get/hint/${hint._id}`).pipe(
      map(res => res)
    );
  }

  getHintsByEnigmaId(enigma: IEnigma): Observable<IHint[]> {
    return this.http.get<any>(`${this.apiUrl}/get/hints/enigma/${enigma._id}`).pipe(
      map(res => res.hints)
    );
  }

  putHint(hint: IHint): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/hint/${hint._id}`, hint);
  }

  deleteHint(hint: IHint): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/hint/${hint._id}`);
  }
}
