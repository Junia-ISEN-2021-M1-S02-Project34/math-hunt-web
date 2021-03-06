import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IEnigma, IFullEnigma} from '../interfaces/enigma.interface';
import {IGeoGroup} from '../interfaces/geoGroup.interface';

@Injectable({
  providedIn: 'root'
})
export class EnigmaService {
  apiUrl = `${environment.apiHostname}/enigmas`;

  constructor(private http: HttpClient) { }

  postEnigma(enigma: IEnigma): Observable<IEnigma> {
    return this.http.post<any>(`${this.apiUrl}/create/enigma`, enigma);
  }

  getEnigmas(): Observable<IEnigma[]> {
    return this.http.get<any>(`${this.apiUrl}/get/enigmas`).pipe(
      map(res => res.enigmas)
    );
  }

  getEnigmaById(enigma: IEnigma): Observable<IEnigma> {
    return this.http.get<any>(`${this.apiUrl}/get/enigma/${enigma._id}`).pipe(
      map(res => res)
    );
  }

  getFullEnigmaById(enigma: IEnigma): Observable<IFullEnigma> {
    return this.http.get<any>(`${this.apiUrl}/get/full/enigma/${enigma._id}`).pipe(
      map(res => res)
    );
  }

  getEnigmasByGeoGroupId(geoGroup: IGeoGroup): Observable<IEnigma[]> {
    return this.http.get<any>(`${this.apiUrl}/get/enigmas/geoGroup/${geoGroup._id}`).pipe(
      map(res => res.enigmas.sort((a: IEnigma, b: IEnigma) => {
        if (a.order < b.order) { return -1; }
        if (a.order > b.order) { return 1; }
        return 0;
      }))
    );
  }

  putEnigma(enigma: IEnigma): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/enigma/${enigma._id}`, enigma);
  }

  deleteEnigma(enigma: IEnigma): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/enigma/${enigma._id}`);
  }
}
