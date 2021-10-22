import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import * as moment from 'moment';
import { CompanyService } from 'src/app/services/company/company.service';
import { MeetingService } from 'src/app/services/meeting/meeting.service';
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
  userMeetings: any[] = [];
  events: CalendarEvent[] = [];

  isPhysical: boolean;
  isVirtual: boolean;
  myMeetings: boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    private meetingService: MeetingService,
    private companyService: CompanyService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // if (localStorage.getItem('isPhysicalSettings')) {
    //   var isPhysicalMemory = JSON.parse(
    //     localStorage.getItem('isPhysicalSettings')
    //   );
    //   this.isPhysical = isPhysicalMemory.isPhysical;
    //   var isVirtuallMemory = JSON.parse(
    //     localStorage.getItem('isVirtualSettings')
    //   );
    //   this.isVirtual = isVirtuallMemory.isVirtual;
    //   var isMinelMemory = JSON.parse(localStorage.getItem('isMineSettings'));
    //   this.myMeetings = isMinelMemory.myMeetings;
    // } else {
    this.isPhysical = false;
    this.isVirtual = false;
    this.myMeetings = false;
    // }

    this.user = JSON.parse(localStorage.getItem('currentUser'));

    this.companyService.getCompany(this.user.companyId).subscribe(
      (response) => {
        this.company = response.company;
      },
      (error) => {
        console.log('Error obtaining company:  ' + error);
      }
    );

    this.meetingService.getAllCompanyMeetings(this.user.companyId).subscribe(
      (response) => {
        this.meetings = response.meetings;
      },
      (error) => {
        console.log('Error obtaining meetings:  ' + error);
      }
    );

    this.meetingService.getAllMeetingsParticipant(this.user.userId).subscribe(
      (response) => {
        for (const meeting of response.physicalMeetings) {
          this.userMeetings.push(meeting);
        }
        for (const meeting of response.virtualMeetings) {
          this.userMeetings.push(meeting);
        }
      },
      (error) => {
        console.log('Error obtaining meetings:  ' + error);
      }
    );
  }

  loadMeetings(): void {
    this.events = [];

    // All Meetings
    if (this.isPhysical && this.isVirtual && !this.myMeetings) {
      this.events = this.meetings.map((m: any) => {
        return {
          title: m.title,
          start: new Date(m.startTime),
          color: m.color,
        };
      });
    }

    // All Physical Meetings
    if (this.isPhysical && !this.isVirtual && !this.myMeetings) {
      var allPhysicalMeetings: any[] = [];

      for (const m of this.meetings) {
        if (m.isPhysical) {
          allPhysicalMeetings.push(m);
        }
      }
      this.events = allPhysicalMeetings.map((m: any) => {
        return {
          title: m.title,
          start: new Date(m.startTime),
          color: m.color,
        };
      });
    }

    // All Virtual Meetings
    if (!this.isPhysical && this.isVirtual && !this.myMeetings) {
      var allVirtuallMeetings: any[] = [];

      for (const m of this.meetings) {
        if (m.isVirtual) {
          allVirtuallMeetings.push(m);
        }
      }
      this.events = allVirtuallMeetings.map((m: any) => {
        return {
          title: m.title,
          start: new Date(m.startTime),
          color: m.color,
        };
      });
    }

    // All My Meetings
    if (this.isPhysical && this.isVirtual && this.myMeetings) {
      this.events = this.userMeetings.map((m: any) => {
        return {
          title: m.title,
          start: new Date(m.startTime),
          color: m.color,
        };
      });
    }

    // All My Physical Meetings
    if (this.isPhysical && !this.isVirtual && this.myMeetings) {
      var allMyPhysicalMeetings: any[] = [];

      for (const m of this.userMeetings) {
        if (m.isPhysical) {
          allMyPhysicalMeetings.push(m);
        }
      }
      this.events = allMyPhysicalMeetings.map((m: any) => {
        return {
          title: m.title,
          start: new Date(m.startTime),
          color: m.color,
        };
      });
    }

    // All My Virtual Meetings
    if (!this.isPhysical && this.isVirtual && this.myMeetings) {
      var allMyVirtuallMeetings: any[] = [];

      for (const m of this.userMeetings) {
        if (m.isVirtual) {
          allMyVirtuallMeetings.push(m);
        }
      }
      this.events = allMyVirtuallMeetings.map((m: any) => {
        return {
          title: m.title,
          start: new Date(m.startTime),
          color: m.color,
        };
      });
    }
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
    console.log('THIS IS PRINTED');
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

  togglePhysical(): void {
    if (this.isPhysical) {
      this.isPhysical = false;
    } else {
      this.isPhysical = true;
    }
    // localStorage.setItem(
    //   'isPhysicalSettings',
    //   JSON.stringify({ isPhysical: this.isPhysical })
    // );
    this.loadMeetings();
  }

  toggleVirtual(): void {
    if (this.isVirtual) {
      this.isVirtual = false;
    } else {
      this.isVirtual = true;
    }
    // localStorage.setItem(
    //   'isVirtualSettings',
    //   JSON.stringify({ isVirtual: this.isVirtual })
    // );
    this.loadMeetings();
  }

  toggleMine(): void {
    if (this.myMeetings) {
      this.myMeetings = false;
    } else {
      this.myMeetings = true;
    }
    // localStorage.setItem(
    //   'isMineSettings',
    //   JSON.stringify({ myMeetings: this.myMeetings })
    // );
    this.loadMeetings();
  }

  hello(weekEvent: any) {
    console.log(weekEvent);
  }
}
