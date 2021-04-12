import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IGeoGroup} from '../interfaces/geogroup.interface';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeoGroupService {
  apiUrl = `${environment.apiHostname}/geoGroups`;

  constructor(private http: HttpClient) { }

  postGeoGroup(geoGroup: IGeoGroup): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/geoGroup`, geoGroup);
  }

  getGeoGroups(): Observable<IGeoGroup[]> {
    return this.http.get<any>(`${this.apiUrl}/get/geoGroups`).pipe(
      map(res => res.geoGroups)
    );
  }

  getGeoGroupById(geoGroup: IGeoGroup): Observable<IGeoGroup> {
    return this.http.get<any>(`${this.apiUrl}/get/geoGroup/${geoGroup._id}`).pipe(
      map(res => res)
    );
  }

  putGeoGroup(geoGroup: IGeoGroup): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/geoGroup/${geoGroup._id}`, geoGroup);
  }

  deleteGeoGroup(geoGroup: IGeoGroup): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/geoGroup/${geoGroup._id}`);
  }
}
