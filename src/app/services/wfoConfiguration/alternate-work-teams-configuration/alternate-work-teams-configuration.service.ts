import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { handleError } from '../../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AlternateWorkTeamsConfigurationService {
  baseUrl: string = `${environment.API_REST_URL}/alternateWorkTeamsConfiguration`;
  constructor(private httpClient: HttpClient) {}

  createAlternateWorkTeamsConfiguration(
    alternateWorkTeamsConfiguration: any
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/create-alternate-work-teams-configuration',
        alternateWorkTeamsConfiguration,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  getAlternateWorkTeamsConfiguration(
    alternateWorkTeamsConfigurationId: any
  ): Observable<any> {
    const paramValue: string = JSON.stringify(alternateWorkTeamsConfigurationId);
    return this.httpClient
      .get<any>(
        `${this.baseUrl}/get-alternate-work-teams-configuration/${paramValue}`,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  updateAlternateWorkTeamsConfiguration(
    alternateWorkTeamsConfiguration: any
  ): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.baseUrl}/update-alternate-work-teams-configuration/${alternateWorkTeamsConfiguration.alternateWorkTeamsConfigurationId}`,
      alternateWorkTeamsConfiguration,
      httpOptions
    );
  }
}
