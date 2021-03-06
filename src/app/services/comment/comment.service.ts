import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  baseUrl: string = `${environment.API_REST_URL}` + '/comment';

  constructor(private httpClient: HttpClient) { }

  getAllCommentsByFeedbackId(feedbackId: string): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-all-comments-by-feedbackId/${feedbackId}`)
      .pipe(catchError(handleError));
  }
  getAllCommentsByTaskId(taskId: string): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/get-all-comments-by-taskId/${taskId}`)
      .pipe(catchError(handleError));
  }
  createNewComment(comment: any): Observable<any> {
    // console.log(department);
    return this.httpClient
      .post<any>(this.baseUrl + '/create-comment', comment)
      .pipe(catchError(handleError));
  }
  updateComment(comment: any): Observable<any> {
    return this.httpClient.patch(
      `${this.baseUrl}/update-comment`,
      comment,
      httpOptions
    );
  }
  deleteComment(commentId: string): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.baseUrl}/delete-comment/${commentId}`)
      .pipe(catchError(handleError));
  }
}
