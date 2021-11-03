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
export class GoalService {
  baseUrl: string = `${environment.API_REST_URL}` + '/goal';

  constructor(private httpClient: HttpClient) {}

  createGoal(goal: any): Observable<any> {
    return this.httpClient
      .post(this.baseUrl + '/create-goal', goal, httpOptions)
      .pipe(catchError(handleError));
  }

  getAllGoalsByCompanyId(companyId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-goals/' + companyId)
      .pipe(catchError(handleError));
  }

  updateGoalById(goal: any): Observable<any> {
    return this.httpClient
      .patch<any>(
        this.baseUrl + '/update-goal-by-id/' + goal.goalId,
        goal,
        httpOptions
      )
      .pipe(catchError(handleError));
  }
}
