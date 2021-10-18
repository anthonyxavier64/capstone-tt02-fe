import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { MeetingService } from 'src/app/services/meeting/meeting.service';

@Component({
  selector: 'app-view-meeting-details-dialog',
  templateUrl: './view-meeting-details-dialog.component.html',
  styleUrls: ['./view-meeting-details-dialog.component.css'],
})
export class ViewMeetingDetailsDialogComponent implements OnInit {
  title: any;
  start: any;
  meeting: any;

  constructor(
    public dialogRef: MatDialogRef<ViewMeetingDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private meetingService: MeetingService
  ) {
    console.log(this.data);
  }

  ngOnInit() {
    this.title = this.data.title;
    this.start = this.data.startTime;
    this.meetingService.getMeetingByTitleDate(this.title, this.start).subscribe(
      (response) => {
        this.meeting = response.meeting;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
