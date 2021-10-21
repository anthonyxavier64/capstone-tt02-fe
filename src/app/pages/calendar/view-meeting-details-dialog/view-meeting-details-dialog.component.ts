import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-view-meeting-details-dialog',
  templateUrl: './view-meeting-details-dialog.component.html',
  styleUrls: ['./view-meeting-details-dialog.component.css'],
  providers: [DatePipe],
})
export class ViewMeetingDetailsDialogComponent implements OnInit {
  title: any;
  start: any;
  end: any;
  meeting: any;
  user: any;
  room: any;

  isOrganiser: boolean;

  constructor(
    public dialogRef: MatDialogRef<ViewMeetingDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private meetingService: MeetingService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.title = this.data.title;
    this.start = this.data.startTime;
    this.user = this.data.user;
    this.isOrganiser = false;

    this.meetingService.getMeetingByTitleDate(this.title, this.start).subscribe(
      (response) => {
        this.meeting = response.meeting;
        this.end = moment(this.meeting.startTime)
          .add(this.meeting.durationInMins, 'minutes')
          .toDate();

        if (this.user.userId == this.meeting.organiserId) {
          this.isOrganiser = true;
        }

        this.roomService.getRoomById(this.meeting.roomId).subscribe(
          (response) => {
            this.room = response.room;
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
