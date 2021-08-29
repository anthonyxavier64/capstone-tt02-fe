import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from '../services-util';
import { User } from 'src/app/models/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const TOKEN_KEY = 'access'; 
const RESET_TOKEN_KEY = 'reset';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = '/api/user';

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  token = '';
  reset = '';

  constructor(private httpClient: HttpClient) {
    this.loadToken();
  }

  loadToken() {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    
    if (storedToken) {
      this.token = storedToken;
      const storedResetToken = localStorage.getItem(RESET_TOKEN_KEY);
      
      if (storedResetToken) {
        this.reset = storedResetToken;
        this.isAuthenticated.next(true);
      }
    } else {
      this.isAuthenticated.next(false);
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

          this.isAuthenticated.next(true);

          resolve(response['user']);
        },
        (error) => {
          this.isAuthenticated.next(false);
          resolve(false);
        }
      )
    })
  }

  getUserAndTokens(email: string, password: string): Observable<any> {
    return this.httpClient
      .post(this.baseUrl + '/login', { email, password }, httpOptions)
      .pipe(catchError(handleError));
  }
}
