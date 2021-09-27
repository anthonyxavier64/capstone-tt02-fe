import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';
import { handleError } from '../../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class OfficeQuotaConfigurationService {
  baseUrl: string = `${environment.API_REST_URL}/officeQuotaConfiguration`;
  constructor(private httpClient: HttpClient) {}

  createOfficeQuotaConfiguration(
    officeQuotaConfiguration: any
  ): Observable<any> {
    console.log(officeQuotaConfiguration);
    return this.httpClient
      .post<any>(
        this.baseUrl + '/create-office-quota-configuration',
        officeQuotaConfiguration,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  getOfficeQuotaConfiguration(
    officeQuotaConfigurationId: any
  ): Observable<any> {
    const paramValue: string = JSON.stringify(officeQuotaConfigurationId);
    return this.httpClient
      .get<any>(
        `${this.baseUrl}/get-office-quota-configuration/${paramValue}`,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  updateOfficeQuotaConfiguration(
    officeQuotaConfiguration: any
  ): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.baseUrl}/update-office-quota-configuration/${officeQuotaConfiguration.officeQuotaConfigurationId}`,
      officeQuotaConfiguration,
      httpOptions
    );
  }
}
