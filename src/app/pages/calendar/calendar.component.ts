import {
  CalendarEvent,
  CalendarView,
  DAYS_OF_WEEK,
  CalendarMonthViewBeforeRenderEvent,
} from 'angular-calendar';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { CompanyService } from 'src/app/services/company/company.service';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covid-document-submission.service';
import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { UserService } from 'src/app/services/user/user.service';
import { UnavailableDateService } from 'src/app/services/unavailableDate/unavailable-date.service';

import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ViewMeetingDetailsDialogComponent } from './view-meeting-details-dialog/view-meeting-details-dialog.component';
import { DayComponent } from './day/day.component';
import { MessageService } from 'primeng/api';

moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.SUNDAY,
    doy: 0,
  },
});
@Component({
  selector: 'app-calendar',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [MessageService],
})
export class CalendarComponent implements OnInit {
  user: any;
  company: any;
  employees: any;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  wfoAllowanceCount: number;

  officeUsersThisMonth: any[];
  meetings: any[];
  userMeetings: any[] = [];
  attendeeMeetings: any[] = [];
  thisMonthMeetings: any[];
  events: CalendarEvent[] = [];
  blockoutDates: any[] = [];
  blockoutDate: any;
  leaveDates: any[] = [];
  leave: any;

  isPhysical: boolean;
  isVirtual: boolean;
  myMeetings: boolean;
  selectedEmployees: any[];
  isWfoSelectionMode: boolean = false;
  datesInOffice: Date[];

  mcStartDate: Date;
  mcEndDate: Date;

  refresh: Subject<any> = new Subject();
  isLoading: boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    private meetingService: MeetingService,
    private companyService: CompanyService,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private unavailableDateService: UnavailableDateService
  ) {
    this.datesInOffice = [];
    this.meetings = [];
    this.officeUsersThisMonth = [];
  }

  ngOnInit() {
    this.isLoading = true;
    this.isPhysical = true;
    this.isVirtual = true;
    this.myMeetings = false;

    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.datesInOffice = this.user.datesInOffice;

    this.unavailableDateService
      .getUnavailableDateByUid(this.user.userId)
      .subscribe(
        (result) => {
          this.leaveDates = result.unavailableDate;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Leaves not found.',
          });
        }
      );

    this.companyService.getCompany(this.user.companyId).subscribe(
      (response) => {
        this.company = response.company;
        this.blockoutDates = this.company.blockoutDates;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error obtaining company.',
        });
      }
    );

    this.meetingService.getAllCompanyMeetings(this.user.companyId).subscribe(
      (response) => {
        this.meetings = response.meetings;
        this.meetings.forEach((item) => {
          var colorNumbers = item.color.substring(4, 17);
          var opacityIncluded = 'rgba(' + colorNumbers + ', 0.3)';
          item.color = opacityIncluded;
        });

        this.loadMeetings();
        this.isLoading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error obtaining meetings for company.',
        });
      }
    );

    this.meetingService.getAllMeetingsParticipant(this.user.userId).subscribe(
      (response) => {
        for (const meeting of response.physicalMeetings) {
          var colorNumbers = meeting.color.substring(4, 17);
          var opacityIncluded = 'rgba(' + colorNumbers + ', 0.3)';
          var updatedItem = { ...meeting, color: opacityIncluded };
          this.userMeetings.push(updatedItem);
        }
        for (const meeting of response.virtualMeetings) {
          var colorNumbers = meeting.color.substring(4, 17);
          var opacityIncluded = 'rgba(' + colorNumbers + ', 0.3)';
          var updatedItem = { ...meeting, color: opacityIncluded };
          this.userMeetings.push(updatedItem);
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error obtaining meetings for user.',
        });
      }
    );

    this.userService.getUsers(this.user.companyId).subscribe((response) => {
      this.employees = response.users;
    });

    this.userService
      .getOfficeUsersByMonth(this.user.companyId, new Date().getMonth())
      .subscribe((response) => {
        this.officeUsersThisMonth = response.users;
      });

    this.covidDocumentSubmissionService.getUserMcs(this.user.userId).subscribe(
      (response) => {
        const latestMc = response.document;
        if (latestMc) {
          this.mcStartDate = new Date(latestMc.startDate);
          this.mcEndDate = new Date(latestMc.endDate);
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error obtaining user MCs.',
        });
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

  viewWfoMode() {
    this.isWfoSelectionMode = true;
    let numDaysInOffice = this.datesInOffice.filter((item) => {
      return new Date(item).getMonth() == new Date().getMonth();
    });
    if (!numDaysInOffice) numDaysInOffice = [];
    this.wfoAllowanceCount =
      this.user.wfoMonthlyAllocation - numDaysInOffice.length;
  }

  escViewWfoMode() {
    if (this.wfoAllowanceCount >= 0) {
      this.isWfoSelectionMode = false;
    }
    this.user.datesInOffice = this.datesInOffice;
    this.userService.updateUserDetails(this.user).subscribe(
      (response) => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      },
      (error) => console.log(error.message)
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

  viewDay(day: any, events: any) {
    if (
      moment(day).day() != DAYS_OF_WEEK.SATURDAY &&
      moment(day).day() != DAYS_OF_WEEK.SUNDAY &&
      !this.isBlockoutDate(day)
    ) {
      let dialogRef = this.dialog.open(DayComponent, {
        data: {
          date: day,
          user: this.user,
          events: events,
        },
        panelClass: 'day-card',
      });
      dialogRef.afterClosed().subscribe((result) => {
        // this.message = result;
      });
    }
  }

  viewMeeting(event: any) {
    let dialogRef = this.dialog.open(ViewMeetingDetailsDialogComponent, {
      data: {
        title: event.title,
        startTime: event.start,
        user: this.user,
        color: event.color,
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
    if (this.attendeeMeetings.length == 0) {
      this.loadMeetings();
    } else {
      this.loadAttendeeMeetings();
    }
  }

  toggleVirtual(): void {
    if (this.isVirtual) {
      this.isVirtual = false;
    } else {
      this.isVirtual = true;
    }
    if (this.attendeeMeetings.length == 0) {
      this.loadMeetings();
    } else {
      this.loadAttendeeMeetings();
    }
  }

  toggleMine(): void {
    if (this.myMeetings) {
      this.myMeetings = false;
    } else {
      this.myMeetings = true;
    }
    this.loadMeetings();
  }

  async handleAttendees(): Promise<void> {
    this.myMeetings = false;
    this.attendeeMeetings = [];

    for (const attendee of this.selectedEmployees) {
      var response = await this.meetingService
        .getAllMeetingsParticipant(attendee.userId)
        .toPromise();
      for (const meeting of response.physicalMeetings) {
        var colorNumbers = meeting.color.substring(4, 17);
        var opacityIncluded = 'rgba(' + colorNumbers + ', 0.3)';
        var updatedItem = { ...meeting, color: opacityIncluded };
        if (
          this.attendeeMeetings.find(
            (item) => item.meetingId === updatedItem.meetingId
          ) === undefined
        ) {
          this.attendeeMeetings.push(updatedItem);
        }
      }
      for (const meeting of response.virtualMeetings) {
        var colorNumbers = meeting.color.substring(4, 17);
        var opacityIncluded = 'rgba(' + colorNumbers + ', 0.3)';
        var updatedItem = { ...meeting, color: opacityIncluded };
        if (
          this.attendeeMeetings.find(
            (item) => item.meetingId === updatedItem.meetingId
          ) === undefined
        ) {
          this.attendeeMeetings.push(updatedItem);
        }
      }
    }

    this.loadAttendeeMeetings();
  }

  loadAttendeeMeetings(): void {
    this.events = [];
    // All Attendee Meetings
    if (this.isPhysical && this.isVirtual) {
      this.attendeeMeetings.sort((a, b) =>
        a.meetingId > b.meetingId ? 1 : -1
      );
      this.events = this.attendeeMeetings.map((m: any) => {
        return {
          title: m.title,
          start: new Date(m.startTime),
          color: m.color,
        };
      });
    }

    // All Attendee Physical Meetings
    if (this.isPhysical && !this.isVirtual) {
      var allAttPhysicalMeetings: any[] = [];

      for (const m of this.attendeeMeetings) {
        if (m.isPhysical) {
          allAttPhysicalMeetings.push(m);
        }
      }
      allAttPhysicalMeetings.sort((a, b) =>
        a.meetingId > b.meetingId ? 1 : -1
      );
      this.events = allAttPhysicalMeetings.map((m: any) => {
        return {
          title: m.title,
          start: new Date(m.startTime),
          color: m.color,
        };
      });
    }

    // All Attendee Virtual Meetings
    if (!this.isPhysical && this.isVirtual) {
      var allAttVirtualMeetings: any[] = [];

      for (const m of this.attendeeMeetings) {
        if (m.isVirtual) {
          allAttVirtualMeetings.push(m);
        }
      }
      allAttVirtualMeetings.sort((a, b) =>
        a.meetingId > b.meetingId ? 1 : -1
      );
      this.events = allAttVirtualMeetings.map((m: any) => {
        return {
          title: m.title,
          start: new Date(m.startTime),
          color: m.color,
        };
      });
    }
  }
  isWithinWfoRange(day: Date) {
    return day.getMonth() == new Date().getMonth();
  }
  isMcDay(day: Date) {
    if (!this.mcStartDate || !this.mcEndDate) return false;
    return day >= this.mcStartDate && day <= this.mcEndDate;
  }
  // To check if the blue button should appear
  isWfoSelectable(day: Date) {
    return (
      this.isWfoSelectionMode &&
      this.isWithinWfoRange(day) &&
      day.getDay() != 0 &&
      day.getDay() != 6
    );
  }
  isWfoSelected(day: Date) {
    const dates = this.datesInOffice.filter((item) => {
      const d = new Date(item);
      return (
        d.getDate() == day.getDate() &&
        d.getMonth() == day.getMonth() &&
        d.getFullYear() == day.getFullYear()
      );
    });
    return dates.length > 0;
  }
  isSelectorDisabled(day: Date) {
    if (this.isMcDay(day) || this.user.isInfected) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return true;

    // Check this user
    if (this.isWfoSelected(day)) {
      return false;
    }

    // Check company wide users
    const dayUsers = this.officeUsersThisMonth.filter((u) => {
      // Check if the user comes to office on this day
      const numMeetingsInOfficeToday = u.datesInOffice.filter(
        (item) => new Date(item).getDate() == day.getDate()
      ).length;
      return numMeetingsInOfficeToday > 0;
    });
    // Disable if the number of people in the office today exceeds capacity
    return dayUsers.length >= this.company.officeCapacity;
  }

  onUnselectDay(day: Date) {
    this.datesInOffice = this.datesInOffice.filter((item) => {
      const d = new Date(item);
      return (
        d.getDate() != day.getDate() ||
        d.getMonth() != day.getMonth() ||
        d.getFullYear() != day.getFullYear()
      );
    });
    this.user.datesInOffice = this.datesInOffice;

    // Update officeUsersThisMonth
    const dayUsers = this.officeUsersThisMonth.filter((u) => {
      return u.userId !== this.user.userId;
    });
    dayUsers.push(this.user);
    this.officeUsersThisMonth = dayUsers;

    this.wfoAllowanceCount++;
  }
  onSelectDay(day: Date) {
    this.datesInOffice.push(day);
    this.user.datesInOffice = this.datesInOffice;
    // Update officeUsersThisMonth
    const dayUsers = this.officeUsersThisMonth.filter((u) => {
      return u.userId !== this.user.userId;
    });
    dayUsers.push(this.user);
    this.officeUsersThisMonth = dayUsers;

    this.wfoAllowanceCount--;
  }

  isBlockoutDate(day: Date) {
    const dates = this.blockoutDates.filter((item) => {
      const bod = new Date(item.date);
      if (
        bod.getDate() == day.getDate() &&
        bod.getMonth() == day.getMonth() &&
        bod.getFullYear() == day.getFullYear()
      ) {
        this.blockoutDate = item;
      }
      return (
        bod.getDate() == day.getDate() &&
        bod.getMonth() == day.getMonth() &&
        bod.getFullYear() == day.getFullYear()
      );
    });
    return dates.length > 0;
  }

  isLeaveDate(day: Date) {
    const dates = this.leaveDates.filter((item) => {
      const leave = new Date(item.date);
      if (
        leave.getDate() == day.getDate() &&
        leave.getMonth() == day.getMonth() &&
        leave.getFullYear() == day.getFullYear()
      ) {
        this.leave = item;
      }
      return (
        leave.getDate() == day.getDate() &&
        leave.getMonth() == day.getMonth() &&
        leave.getFullYear() == day.getFullYear()
      );
    });
    return dates.length > 0;
  }
}
