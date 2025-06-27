import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DAOService {
  constructor(protected http: HttpClient) {}

  getObjects(urlObject: string, parameters?: any): Observable<any> {
    return this.http.get(urlObject, { params: parameters });
  }

  getObject(urlObject: string, id: string | number, parameters?: HttpParams): Observable<any> {
    return this.http.get(urlObject + `${id}`, { params: parameters });
  }

  postObject(urlObject: string, object: any): Observable<any> {
    return this.http.post(urlObject, object);
  }

  putObject(urlObject: string, object: any): Observable<any> {
    return this.http.put(urlObject, object);
  }

  patchObject(urlObject: string, object: any): Observable<any> {
    const objectId = object.id;
    return this.http.patch(urlObject + `${objectId}/`, object);
  }

  deleteObject(urlObject: string, id: string): Observable<any> {
    return this.http.delete(`${urlObject}${id}/`);
  }
}
