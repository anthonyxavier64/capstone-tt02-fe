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
export class FeedbackService {
  baseUrl: string = `${environment.API_REST_URL}` + '/feedback';

  constructor(private httpClient: HttpClient) { }

  getFeedbackSent(senderId: string): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-all-feedbacks-by-senderId/${senderId}`)
      .pipe(catchError(handleError));
  }
  getFeedbackReceived(receiverId: string): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-all-feedbacks-by-receiverId/${receiverId}`)
      .pipe(catchError(handleError));
  }
  createNewFeedback(feedback: any): Observable<any> {
    // console.log(department);
    return this.httpClient
      .post<any>(this.baseUrl + '/create-feedback', feedback)
      .pipe(catchError(handleError));
  }
}
