import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../models/user';
import { handleError } from '../services-util';
import { environment } from 'src/environments/environment.dev';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = environment.API_REST_URL + '/user';

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
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
}
