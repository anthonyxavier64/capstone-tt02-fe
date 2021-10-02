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
export class TaskService {
  baseUrl: string = `${environment.API_REST_URL}` + '/task';

  constructor(private httpClient: HttpClient) {}

  getAllTasksByGoalId(goalId: string, userId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl + '/get-all-tasks-goal-user/' + goalId + '/' + userId
      )
      .pipe(catchError(handleError));
  }

  getAllTasksByUser(userId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl + '/get-all-tasks-user/' + userId
      )
      .pipe(catchError(handleError));
  }

  createTask(task: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + '/create-task', task, httpOptions)
      .pipe(catchError(handleError));
  }

  updateTask(task: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + '/update-task', task, httpOptions)
      .pipe(catchError(handleError));
  }

  addUsersToTask(users: any, taskId: string): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + '/add-users/', { users, taskId }, httpOptions)
      .pipe(catchError(handleError));
  }
}
