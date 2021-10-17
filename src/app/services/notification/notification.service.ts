import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  baseUrl: string =
    `${environment.API_REST_URL}` + '/notification';

  constructor(private httpClient: HttpClient) {}

  getAllNotifications(userId: number): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-notifications/${userId}`)
      .pipe(catchError(handleError));
  }
  getReadNotifications(userId: number): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-read-notifications/${userId}`)
      .pipe(catchError(handleError));
  }
  getUnreadNotifications(userId: number): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-unread-notifications/${userId}`)
      .pipe(catchError(handleError));
  }
  createNotification(notification: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + '/create-notification', notification)
      .pipe(catchError(handleError));
  }
  updateNotification(notification: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + '/update-notification', notification, httpOptions)
      .pipe(catchError(handleError));
  }
}
