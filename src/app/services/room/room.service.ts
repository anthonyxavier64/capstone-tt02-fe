import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.dev';
import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  baseUrl: string = `${environment.API_REST_URL}/room`;

  constructor(private httpClient: HttpClient) {}

  createRoom(room: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + '/create-room', room, httpOptions)
      .pipe(catchError(handleError));
  }

  updateRoom(room: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + '/update-room', room, httpOptions)
      .pipe(catchError(handleError));
  }

  deleteRoom(roomId: string): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + '/delete-room', { roomId }, httpOptions)
      .pipe(catchError(handleError));
  }
}
