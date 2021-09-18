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
export class CompanyDetailsService {
  baseUrl: string = `${environment.API_REST_URL}/company`;

  constructor(private httpClient: HttpClient) {}

  getCompanyById(companyId: string): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + '/get-company', { companyId }, httpOptions)
      .pipe(catchError(handleError));
  }

  updateCompany(company: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + '/update-company', company, httpOptions)
      .pipe(catchError(handleError));
  }
}
