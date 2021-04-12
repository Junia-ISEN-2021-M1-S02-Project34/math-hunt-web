import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ITeam} from '../interfaces/team.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  apiUrl = `${environment.apiHostname}/teams`;

  constructor(private http: HttpClient) { }

  postTeam(team: ITeam): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/team`, team);
  }

  getTeams(): Observable<ITeam[]> {
    return this.http.get<any>(`${this.apiUrl}/get/teams`).pipe(
      map(res => res.teams)
    );
  }

  getTeamById(team: ITeam): Observable<ITeam> {
    return this.http.get<any>(`${this.apiUrl}/get/team/${team._id}`).pipe(
      map(res => res)
    );
  }

  putTeam(team: ITeam): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/team/${team._id}`, team);
  }

  deleteTeam(team: ITeam): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/team/${team._id}`);
  }
}
