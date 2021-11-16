import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
export class UserService {
  baseUrl: string = environment.API_REST_URL + '/user';

  constructor(private httpClient: HttpClient) {}

  getUsers(companyId: string): Observable<any> {
    let params = new HttpParams().set('companyId', companyId);

    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-users', { params })
      .pipe(catchError(handleError));
  }

  getDepartments(userId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-departments/' + userId)
      .pipe(catchError(handleError));
  }

  getManagedDepartments(userId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-managed-departments/' + userId)
      .pipe(catchError(handleError));
  }

  forgotPassword(email: string): Observable<any> {
    return this.httpClient
      .post(this.baseUrl + '/forgot-password', { email }, httpOptions)
      .pipe(catchError(handleError));
  }

  resetPassword(
    userId: String,
    oldpassword: String,
    password1: String,
    password2: String
  ): Observable<any> {
    return this.httpClient
      .post(
        this.baseUrl + '/reset-password',
        { userId, oldpassword, password1, password2 },
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  createNewUser(user: any) {
    return this.httpClient
      .post<any>(this.baseUrl + '/register', user)
      .pipe(catchError(handleError));
  }

  sendVerificationEmail(userId: String) {
    return this.httpClient
      .post<any>(this.baseUrl + '/send-verification-email', { userId: userId })
      .pipe(catchError(handleError));
  }

  updateUserDetails(user: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + '/me', user, httpOptions)
      .pipe(catchError(handleError));
  }

  getUser(userId: number): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-user/${userId}`, httpOptions)
      .pipe(catchError(handleError));
  }

  getUserByEmail(email: string): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + `/get-user-by-email/${email}`,
      httpOptions
    );
  }

  deleteUser(userId: String) {
    return this.httpClient
      .delete<any>(this.baseUrl + '/delete-user/' + userId)
      .pipe(catchError(handleError));
  }

  updateUserDetailsByUserId(userId: any, updateDetails: any) {
    return this.httpClient.patch<any>(
      `${this.baseUrl}/update-user-by-id/${userId}`,
      updateDetails,
      httpOptions
    );
  }

  getUserDocuments(userId: any) {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-user-submissions/${userId}`, httpOptions)
      .pipe(catchError(handleError));
  }
  getOfficeUsersByMonth(companyId: number, month: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.baseUrl}/get-office-users-by-month/${companyId}/${month}`,
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  getDepartmentUsers(departmentName: any) {
    return this.httpClient
      .get<any>(
        `${this.baseUrl}/get-department-users/${departmentName}`,
        httpOptions
      )
      .pipe(catchError(handleError));
  }
}
