import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.dev';
import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  baseUrl: string = `${environment.API_REST_URL}`;

  constructor(private httpClient: HttpClient) {}

  createCreationRequest(request: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/company-creation-request/create-request',
        request,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  getCompany(companyId: String): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/company/get-company',
        { companyId },
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  getCompanyCreationRequestById(
    companyCreationRequestId: String
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl +
          '/company-creation-request/get-request/' +
          companyCreationRequestId
      )
      .pipe(catchError(handleError));
  }
}
