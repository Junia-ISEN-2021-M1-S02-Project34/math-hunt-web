import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IAnswer} from '../interfaces/answer.interface';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  apiUrl = `${environment.apiHostname}/answers`;

  constructor(private http: HttpClient) { }

  postAnswer(answer: IAnswer): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/answer`, answer);
  }

  getAnswers(): Observable<IAnswer[]> {
    return this.http.get<any>(`${this.apiUrl}/get/answers`).pipe(
      map(res => res.answers)
    );
  }

  getAnswerById(answer: IAnswer): Observable<IAnswer> {
    return this.http.get<any>(`${this.apiUrl}/get/answer/${answer._id}`).pipe(
      map(res => res)
    );
  }

  putAnswer(answer: IAnswer): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update/answer/${answer._id}`, answer);
  }

  deleteAnswer(answer: IAnswer): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/answer/${answer._id}`);
  }
}
