import { DateAdapter } from 'angular-calendar';
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
export class MeetingService {
  baseUrl: string = `${environment.API_REST_URL}` + '/meeting';

  constructor(private httpClient: HttpClient) { }

  createNewMeeting(meeting: any): Observable<any> {
    return this.httpClient
      .post<any>(`${this.baseUrl}/create-meeting`, meeting, httpOptions)
      .pipe(catchError(handleError));
  }

  getAllCompanyMeetings(companyId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-meetings/' + companyId)
      .pipe(catchError(handleError));
  }

  getMeetingsByDate(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl +
        `/get-meetings-by-date/${companyId}/${startDate.toString()}/${endDate.toString()}`
      )
      .pipe(catchError(handleError));
  }

  getAllMeetingsOrganiser(organiserId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl + '/get-all-meetings-user-organiser/' + organiserId
      )
      .pipe(catchError(handleError));
  }
  
  getMeetingByTitleDate(title: string, startTime: Date): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + '/get-meeting' + '/' + title + '/' + startTime
    );
  }

  getMeetingByMeetingId(meetingId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-meeting' + '/' + meetingId)
      .pipe(catchError(handleError));
  }

  getAllMeetingsParticipant(participantId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl + '/get-all-meetings-user-participant/' + participantId
      )
      .pipe(catchError(handleError));
  }

  getAllMeetingsRsvp(userId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-all-meetings-user-rsvp/' + userId)
      .pipe(catchError(handleError));
  }

  rsvpToMeeting(
    meetingId: string,
    isPhysicalRsvp: boolean,
    userId: string
  ): Observable<any> {
    return this.httpClient.patch<any>(this.baseUrl + '/rsvp-to-meeting', {
      meetingId,
      isPhysicalRsvp,
      userId,
    });
  }

  getAllMeetingsByDate(companyId: string, date: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl + '/get-meetings-by-date/' + companyId + '/' + date
      )
      .pipe(catchError(handleError));
  }

  getMeetingAttendees(meetingId: string): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + '/get-meeting-attendees/' + meetingId
    );
  }

  updateMeeting(meeting: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + '/update-meeting', meeting)
      .pipe(catchError(handleError));
  }

  deleteMeeting(meetingId: string): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + '/delete-meeting/' + meetingId)
      .pipe(catchError(handleError));
  }
}
