import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Announcement } from '../../models/announcement';
import { AuthService } from '../../services/user/auth.service';

import { environment } from '../../../environments/environment.dev';
import { AnnouncementType } from 'src/app/models/announcement-type';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  baseUrl: string = `${environment.API_REST_URL}/announcement`

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.httpClient.get<Announcement[]>(`${this.baseUrl}/get-all-announcements`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getCovidAnnouncements(): Observable<Announcement[]> {
    const userId = 1;
    return this.httpClient.get<Announcement[]>(`${this.baseUrl}/get-covid-announcements/${userId}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getGeneralAnnouncements(): Observable<Announcement[]> {
    return this.httpClient.get<Announcement[]>(`${this.baseUrl}/get-general-announcements`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAnnouncement(announcementId: any): Observable<Announcement> {
    return this.httpClient.get<Announcement>(`${this.baseUrl}/get-announcement/${announcementId}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createAnnouncement(title: string | undefined, description: string | undefined, announcementType: AnnouncementType): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/create-announcement`,
      { title, description, announcementType }, httpOptions).pipe(
        catchError(this.handleError)
      );
  }

  updateAnnouncement(announcementId: number | undefined, title: string | undefined, description: string | undefined, announcementType: AnnouncementType): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/update-announcement/${announcementId}`, { title, description, announcementType }, httpOptions);
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
