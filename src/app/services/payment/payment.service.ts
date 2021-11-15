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
export class PaymentService {
  baseUrl: string = `${environment.API_REST_URL}` + '/payment';

  constructor(private httpClient: HttpClient) {}

  createSubscription(
    companyCreationRequestId: string,
    creditCardDetails: Object
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/create-subscription',
        {
          companyCreationRequestId,
          creditCardDetails,
        },
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  updateSubscription(
    companyId: string,
    subscriptionType: string
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/update-subscription',
        {
          companyId,
          subscriptionType,
        },
        httpOptions
      )
      .pipe(catchError(handleError));
  }
}
