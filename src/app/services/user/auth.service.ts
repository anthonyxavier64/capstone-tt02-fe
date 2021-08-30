import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from '../services-util';
import { User } from 'src/app/models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TOKEN_KEY, RESET_TOKEN_KEY } from 'src/app/config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = '/api/user';

  token = '';
  reset = '';

  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService
  ) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    } else {
      return false;
    }
  }

  login(email: string, password: string) {
    return new Promise(async (resolve) => {
      this.getUserAndTokens(email, password).subscribe(
        (response) => {
          const newToken = response['token'];
          const newResetToken = response['resetToken'];

          localStorage.setItem(TOKEN_KEY, newToken);
          localStorage.setItem(RESET_TOKEN_KEY, newResetToken);

          this.token = newToken;
          this.reset = newResetToken;

          resolve(response['user']);
        },
        (error) => {
          resolve(false);
        }
      );
    });
  }

  getUserAndTokens(email: string, password: string): Observable<any> {
    return this.httpClient
      .post(this.baseUrl + '/login', { email, password }, httpOptions)
      .pipe(catchError(handleError));
  }
}
