import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { MeetingService } from 'src/app/services/meeting/meeting.service';

@Component({
  selector: 'app-delete-meeting-dialog',
  templateUrl: './delete-meeting-dialog.component.html',
  styleUrls: ['./delete-meeting-dialog.component.css'],
})
export class DeleteMeetingDialogComponent implements OnInit {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {}

  onConfirmClick() {
    this.meetingService
      .deleteMeeting(this.config.data.meetingId)
      .subscribe((response) => {
        this.config.data.confirmDelete = true;
        this.ref.close(this.config);
      });
  }

  onCloseClick() {
    this.ref.close();
  }
}
