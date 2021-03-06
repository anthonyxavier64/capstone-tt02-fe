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
export class CompanyDetailsService {
  baseUrl: string = `${environment.API_REST_URL}/company`;

  constructor(private httpClient: HttpClient) {}

  getCompanyById(companyId: string): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + '/get-company', { companyId }, httpOptions)
      .pipe(catchError(handleError));
  }

  getOfficeQuotaConfig(wfoConfigId: string): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/get-company-office-quota-config',
        { wfoConfigId },
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  getAlternateWorkTeamsConfig(wfoConfigId: string): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/get-company-alternate-work-teams-config',
        { wfoConfigId },
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  updateCompany(company: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + '/update-company', company, httpOptions)
      .pipe(catchError(handleError));
  }

  updateCompanyWfoSelection(company: any): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + '/update-company-wfo-config',
      company,
      httpOptions
    );
  }

  getCompanyCreationRequestByHash(hash: String): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-request-hash/' + hash)
      .pipe(catchError(handleError));
  }
}
