import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.dev';
import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class GetAllEmployeesService {
  baseUrl: string = `${environment.API_REST_URL}/user`;

  constructor(private httpClient: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.baseUrl + '/get-all-users')
      .pipe(catchError(handleError));
  }
}
