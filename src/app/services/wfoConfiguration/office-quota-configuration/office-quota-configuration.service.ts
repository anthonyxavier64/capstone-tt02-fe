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
  baseUrl: string = `${environment.API_REST_URL}`;
  constructor(private httpClient: HttpClient) {}

  createOfficeQuotaConfiguration(
    officeQuotaConfiguration: any
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl +
          '/officeQuotaConfiguration/create-office-quota-configuration',
        officeQuotaConfiguration,
        httpOptions
      )
      .pipe(catchError(handleError));
  }
}
