import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IProposition} from '../interfaces/proposition.interface';

@Injectable({
  providedIn: 'root'
})
export class PropositionService {
  apiUrl = `${environment.apiHostname}/propositions`;

  constructor(private http: HttpClient) { }

  postProposition(proposition: IProposition): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/proposition`, proposition);
  }

  getPropositions(): Observable<IProposition[]> {
    return this.http.get<any>(`${this.apiUrl}/get/propositions`).pipe(
      map(res => res.propositions)
    );
  }

  getPropositionById(proposition: IProposition): Observable<IProposition> {
    return this.http.get<any>(`${this.apiUrl}/get/proposition/${proposition._id}`).pipe(
      map(res => res)
    );
  }

  putProposition(proposition: IProposition): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update/proposition/${proposition._id}`, proposition);
  }

  deleteProposition(proposition: IProposition): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/proposition/${proposition._id}`);
  }
}
