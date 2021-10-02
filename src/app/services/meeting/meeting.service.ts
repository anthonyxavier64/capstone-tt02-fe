import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';
import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  baseUrl: string = `${environment.API_REST_URL}` + '/meeting';

  constructor(private httpClient: HttpClient) {}

  getAllMeetingsOrganiser(organiserId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl + '/get-all-meetings-user-organiser/' + organiserId
      )
      .pipe(catchError(handleError));
  }


}
