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
export class BlockoutDateService {
  baseUrl: string = `${environment.API_REST_URL}/blockoutDate`;

  constructor(private httpClient: HttpClient) {}

  createBlockoutDate(blockoutDate: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/create-blockoutDate',
        blockoutDate,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  updateBlockoutDate(blockoutDate: any): Observable<any> {
    return this.httpClient
      .patch<any>(
        this.baseUrl + '/update-blockoutDate',
        blockoutDate,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  deleteBlockoutDate(blockoutDateId: string): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/delete-blockoutDate',
        { blockoutDateId },
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  getBlockoutDateById(blockoutDateId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-blockoutDate' + '/' + blockoutDateId)
      .pipe(catchError(handleError));
  }
}
