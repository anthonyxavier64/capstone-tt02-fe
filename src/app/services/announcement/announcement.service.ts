import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnnouncementType } from 'src/app/models/announcement-type';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.dev';
import { Announcement } from '../../models/announcement';
import { AuthService } from '../../services/user/auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  baseUrl: string = `${environment.API_REST_URL}/announcement`

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getAllAnnouncements(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/get-all-announcements`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getCovidAnnouncements(senderId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/get-covid-announcements/${senderId}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getGeneralAnnouncements(senderId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/get-general-announcements/${senderId}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAnnouncement(announcementId: any): Observable<Announcement> {
    return this.httpClient.get<Announcement>(`${this.baseUrl}/get-announcement/${announcementId}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createAnnouncement(announcement: Announcement): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/create-announcement`,
      announcement, httpOptions).pipe(
        catchError(this.handleError)
      );
  }

  updateAnnouncement(announcement: Announcement): Observable<any> {
    console.log(announcement);
    return this.httpClient.patch(`${this.baseUrl}/update-announcement/${announcement.announcementId}`, announcement, httpOptions);
  }

  deleteAnnouncement(announcementId: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/delete-announcement/${announcementId}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = "";

    if (error.error instanceof ErrorEvent) {
      errorMessage = "An unknown error has occurred: " + error.error;
    }
    else {
      errorMessage = "A HTTP error has occurred: " + `HTTP ${error.status}: ${error.error}`;
    }

    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
