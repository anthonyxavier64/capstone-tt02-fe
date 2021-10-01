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
  baseUrl: string = `${environment.API_REST_URL}` + '/department';

  constructor(private httpClient: HttpClient) { }

  getAllDepartments(companyId: string): Observable<any> {
    let params = new HttpParams().set('companyId', companyId);

    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-departments', { params })
      .pipe(catchError(handleError));
  }

  createCovidDocumentSubmission(submission: any) {
    console.log(submission);
    this.httpClient
      .post<any>(this.baseUrl + '/create-covid-document-submission', submission)
      .pipe(catchError(handleError))
      .subscribe((response) => {
        console.log(response);
      });
  }

  updateDocument(submission: any): Observable<any> {
    console.log(submission);
    return this.httpClient.patch(`${this.baseUrl}/update-covid-document-submission/${submission.covidDocumentSubmissionId}`, submission, httpOptions);
  }
}
