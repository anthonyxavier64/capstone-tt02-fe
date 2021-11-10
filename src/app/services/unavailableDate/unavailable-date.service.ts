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
export class UnavailableDateService {
  baseUrl: string = `${environment.API_REST_URL}/unavailableDate`;

  constructor(private httpClient: HttpClient) {}

  createUnavailableDate(unavailableDate: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/create-unavailabledate',
        unavailableDate,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  updateUnavailableDate(unavailableDate: any): Observable<any> {
    return this.httpClient
      .patch<any>(
        this.baseUrl + '/update-unavailabledate',
        unavailableDate,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  deleteUnavailableDate(unavailableDateId: string): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/delete-unavailabledate',
        { unavailableDateId },
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  getUnavailableDateById(unavailableDateId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-unavailabledate' + '/' + unavailableDateId)
      .pipe(catchError(handleError));
  }

  getUnavailableDateByUid(userId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-unavailabledate-user' + '/' + userId)
      .pipe(catchError(handleError));
  }
}
