import * as moment from 'moment';

import { CalendarEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.MONDAY,
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

  events: CalendarEvent[] = [
    {
      title: 'Has custom class',
      start: new Date(),
      cssClass: 'my-custom-class',
    },
  ];

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
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
}
