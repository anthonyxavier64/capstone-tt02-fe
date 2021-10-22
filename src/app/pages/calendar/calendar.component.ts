import { CalendarEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import * as moment from 'moment';
import { CompanyService } from 'src/app/services/company/company.service';
import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { UserService } from 'src/app/services/user/user.service';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  currentPeriodStart: Date;
  currentPeriodEnd: Date;

  meetings: any[];
  events: CalendarEvent[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private meetingService: MeetingService,
    private companyService: CompanyService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));

    this.companyService.getCompany(this.user.companyId).subscribe(
      (response) => {
        this.company = response.company;
        console.log(this.company);
      },
      (error) => {
        console.log('Error obtaining company:  ' + error);
      }
    );
  }
  beforeMonthViewRender(e: any) {
    console.log("New Month");

    this.currentPeriodStart = e.period.start;
    this.currentPeriodEnd = e.period.end;

    this.meetingService.getMeetingsByDate(this.user.companyId, this.currentPeriodStart, this.currentPeriodEnd)
      .subscribe(
        (response) => {
          this.meetings = response.meetings;
          console.log(response.meetings);
          this.events = this.meetings.map((m: any) => {
            return {
              title: m.title,
              start: new Date(m.startTime),
              color: m.color,
            };
          });
        },
        (error) => {
          console.log('Error obtaining meetings:  ' + error);
        }
      );
  }
  viewWfoMode() {

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

  viewMeeting(event: any) {
    let dialogRef = this.dialog.open(ViewMeetingDetailsDialogComponent, {
      data: {
        title: event.title,
        startTime: event.start,
        user: this.user,
      },
      panelClass: 'meeting-card',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.message = result;
    });
  }
}
