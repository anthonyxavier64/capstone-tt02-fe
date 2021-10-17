import * as moment from 'moment';

import { CalendarEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { ViewMeetingDetailsDialogComponent } from './view-meeting-details-dialog/view-meeting-details-dialog.component';

moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.SUNDAY,
    doy: 0,
  },
});
@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  user: any;
  company: any;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;

  meetings: any[];
  events: CalendarEvent[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private meetingService: MeetingService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));

    this.meetingService.getAllCompanyMeetings(this.user.companyId).subscribe(
      (response) => {
        this.meetings = response.meetings;
        console.log(this.meetings);
        this.events = this.meetings.map((m: any) => {
          return {
            title: m.title,
            start: new Date(m.startTime),
            color: m.color,
          };
        });
        console.log(this.events);
      },
      (error) => {
        console.log('Error obtaining meetings:  ' + error);
      }
    );
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  scheduleMeeting(): void {
    this.router.navigateByUrl('/create-meeting');
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (moment(date).isSame(this.viewDate.getMonth())) {
      if (
        (moment(this.viewDate).isSame(date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  viewMeeting(): void {
    let dialogRef = this.dialog.open(ViewMeetingDetailsDialogComponent, {
      width: '250px',
      data: 'test',
      panelClass: 'meeting-card',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.message = result;
    });
  }
}
