import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.dev'
import { handleError } from '../services-util';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  baseUrl: string = environment.API_REST_URL;

  constructor(private httpClient: HttpClient) { }

  // to edit argument
  getCompany(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/get-company")
        .pipe(catchError(handleError));
  }

  updateCompany(companyToUpdate: any): Observable<any> {    
    return this.httpClient.post<any>(this.baseUrl + "/update-company", companyToUpdate)
        .pipe(catchError(handleError));
    }

}
