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
export class GoalService {
  baseUrl: string = `${environment.API_REST_URL}` + '/goal';

  constructor(private httpClient: HttpClient) {}

  getAllGoalsByCompanyId(companyId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-goals/' + companyId)
      .pipe(catchError(handleError));
  }

  getGoalById(goalId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-goal/' + goalId)
      .pipe(catchError(handleError));
  }
}
