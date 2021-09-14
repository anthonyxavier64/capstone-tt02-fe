import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
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

  getAllUsers() {
    return new Promise(async (resolve) => {
      this.httpClient
        .get(this.baseUrl + '/get-all-users', httpOptions)
        .pipe(catchError(handleError))
        .subscribe(
          (response) => {
            // resolve(response['users']);
          },
          (error) => {
            resolve(false);
          }
        );
    });
  }
}
