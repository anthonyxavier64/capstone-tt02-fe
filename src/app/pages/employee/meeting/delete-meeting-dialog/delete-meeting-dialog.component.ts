import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MeetingService } from 'src/app/services/meeting/meeting.service';

@Component({
  selector: 'app-delete-meeting-dialog',
  templateUrl: './delete-meeting-dialog.component.html',
  styleUrls: ['./delete-meeting-dialog.component.css'],
})
export class DeleteMeetingDialogComponent implements OnInit {
  meetingId: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteMeetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { meetingId: string },
    private meetingService: MeetingService
  ) {
    this.meetingId = data.meetingId;
  }

  ngOnInit(): void {}

  onConfirmClick() {
    this.meetingService.deleteMeeting(this.meetingId).subscribe((response) => {
      this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
