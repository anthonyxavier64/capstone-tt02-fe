import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';
import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  baseUrl: string = `${environment.API_REST_URL}` + '/department';

  constructor(private httpClient: HttpClient) {}

  getAllDepartments(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-departments')
      .pipe(catchError(handleError));
  }

  createNewDepartment(department: any) {
    console.log(department);
    this.httpClient
      .post<any>(this.baseUrl + '/create-department', department)
      .pipe(catchError(handleError))
      .subscribe((response) => {
        console.log(response);
      });
  }

  // TODO: Will be updated when service is ready
  updateDepartment(department: any) {
    this.httpClient
      .post<any>(this.baseUrl + '/get-department', department)
      .pipe(catchError(handleError));
  }
}
