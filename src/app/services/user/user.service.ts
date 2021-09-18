import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';
import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = environment.API_REST_URL + '/user';

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-users')
      .pipe(catchError(handleError));
  }

  getDepartments(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-departments')
      .pipe(catchError(handleError));
  }

  getManagedDepartments(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-managed-departments')
      .pipe(catchError(handleError));
  }

  createNewUser(user: any) {
    console.log(JSON.stringify(user));
    return this.httpClient
      .post<any>(this.baseUrl + '/register', user)
      .pipe(catchError(handleError));
  }

  sendVerificationEmail(userId: String) {
    return this.httpClient
      .post<any>(this.baseUrl + '/send-verification-email', userId)
      .pipe(catchError(handleError));
  }
}
