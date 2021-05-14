import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IGeoGroup} from '../interfaces/geoGroup.interface';
import {map} from 'rxjs/operators';
import {IEnigma} from '../interfaces/enigma.interface';

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
      map(res => res.geoGroups.sort((a: IGeoGroup, b: IGeoGroup) => {
        if (a.order < b.order) { return -1; }
        if (a.order > b.order) { return 1; }
        return 0;
      }))
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
