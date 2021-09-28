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

  getDepartments(email: string): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + '/get-departments', { email }, httpOptions)
      .pipe(catchError(handleError));
  }

  getManagedDepartments(email: string): Observable<any> {
    return this.httpClient
      .post<any>(
        this.baseUrl + '/get-managed-departments',
        { email },
        httpOptions
      )
      .pipe(catchError(handleError));
  }

  resetPassword(
    email: string,
    oldpassword: string,
    password1: string,
    password2: string
  ): Observable<any> {
    return this.httpClient
      .post(
        this.baseUrl + '/reset-password',
        { email, oldpassword, password1, password2 },
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

  deleteUser(userId: String) {
    return this.httpClient.post<any>(this.baseUrl + '/delete-user', {
      userId: userId,
    });
  }

  updateUserDetailsByUserId(userId: String, updateDetails: any) {
    console.log(updateDetails);
    return this.httpClient.patch<any>(
      `${this.baseUrl}/update-user-by-id/${userId}`,
      updateDetails,
      httpOptions
    );
  }
}
