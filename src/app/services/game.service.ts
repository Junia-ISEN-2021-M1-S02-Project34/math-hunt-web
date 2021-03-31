import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IGame} from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  apiUrl = `${environment.apiHostname}/games`;

  constructor(private http: HttpClient) { }

  postGame(game: IGame): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/game`, game);
  }

  getGames(): Observable<IGame[]> {
    return this.http.get<any>(`${this.apiUrl}/get/games`).pipe(
      map(res => res.games)
    );
  }

  getGameById(game: IGame): Observable<IGame> {
    return this.http.get<any>(`${this.apiUrl}/get/game/${game._id}`).pipe(
      map(res => res.game)
    );
  }

  putGame(game: IGame): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update/game/${game._id}`, game);
  }

  deleteGame(game: IGame): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/game/${game._id}`);
  }
}
