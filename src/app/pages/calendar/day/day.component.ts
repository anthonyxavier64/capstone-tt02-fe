import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import * as moment from 'moment';
import { Router } from '@angular/router';

import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { ViewMeetingDetailsDialogComponent } from '../view-meeting-details-dialog/view-meeting-details-dialog.component';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css'],
})
export class DayComponent implements OnInit {
  date: any;
  events: any[] = [];
  user: any;
  meeting: any;
  meetings: any[] = [];

  numInOffice: any;
  officeCapacityCount: any;

  constructor(
    public dialogRef: MatDialogRef<DayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private meetingService: MeetingService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.date = this.data.date;
    this.user = this.data.user;
    this.events = this.data.events;
    this.numInOffice = this.data.numInOffice;
    this.officeCapacityCount = this.data.officeCapacityCount;

    for (const e of this.events) {
      this.meetingService.getMeetingByTitleDate(e.title, e.start).subscribe(
        (response) => {
          this.meeting = response.meeting;
          const endTime = moment(this.meeting.startTime)
            .add(this.meeting.durationInMins, 'minutes')
            .toDate();
          this.meeting = {
            title: this.meeting.title,
            start: this.meeting.startTime,
            end: endTime,
            color: e.color,
          };
          this.meetings.push(this.meeting);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    console.log(this.meetings);
  }

  scheduleMeeting(): void {
    this.router.navigateByUrl('/create-meeting');
  }

  viewMeeting(meeting: any) {
    this.dialogRef.close();
    let dialogRef = this.dialog.open(ViewMeetingDetailsDialogComponent, {
      data: {
        title: meeting.title,
        startTime: meeting.start,
        user: this.user,
        color: meeting.color,
      },
      panelClass: 'meeting-card',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.message = result;
    });
  }
}
