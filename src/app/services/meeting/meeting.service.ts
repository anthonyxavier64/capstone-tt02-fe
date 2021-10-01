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
export class MeetingService {
  baseUrl: string = environment.API_REST_URL + '/meeting';

  constructor(private httpClient: HttpClient) {}

  createNewUser(meeting: any) {
    return this.httpClient
      .post<any>(this.baseUrl + '/create-meeting', meeting)
      .pipe(catchError(handleError));
  }

  getAllMeetingsUserRsvp(userId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-meetings-user-rsvp/' + userId)
      .pipe(catchError(handleError));
  }

  getAllMeetingsUserOrganiser(userId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-meetings-user-organiser/' + userId)
      .pipe(catchError(handleError));
  }

  getMeetingById(meetingId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-meeting/' + meetingId)
      .pipe(catchError(handleError));
  }

  updateCompany(meeting: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + '/update-meeting', meeting, httpOptions)
      .pipe(catchError(handleError));
  }

  rsvpToMeeting(body: any): Observable<any> {
    // Body comes in the format of:
    //   {
    //     "meetingId" : "1",
    //     "userId" : "1"
    //   }
    return this.httpClient
      .patch<any>(this.baseUrl + '/rsvp-to-meeting', body, httpOptions)
      .pipe(catchError(handleError));
  }

  // Backend for this works, but not too sure how to test if the service works rn
  // Will wait til SR3 to test since this isnt impt for SR2
  removeMeeting(meetingId: String) {
    return this.httpClient.delete<any>(this.baseUrl + '/delete-user', {
      body: meetingId,
    });
  }
}
