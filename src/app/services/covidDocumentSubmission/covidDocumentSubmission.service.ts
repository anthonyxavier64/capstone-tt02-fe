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
export class CovidDocumentSubmissionService {
  baseUrl: string =
    `${environment.API_REST_URL}` + '/covid-document-submission';

  constructor(private httpClient: HttpClient) {}

  getUserSubmissions(userId: number): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-user-submissions/${userId}`)
      .pipe(catchError(handleError));
  }
  createCovidDocumentSubmission(submission: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + '/create-covid-document-submission', submission)
      .pipe(catchError(handleError));
  }
  updateDocument(submission: any): Observable<any> {
    return this.httpClient.patch(
      `${this.baseUrl}/update-covid-document-submission/${submission.covidDocumentSubmissionId}`,
      submission,
      httpOptions
    );
  }
  getCovidDocumentSubissionById(submissionId: any): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-submission-by-id/' + submissionId)
      .pipe(catchError(handleError));
  }
}
