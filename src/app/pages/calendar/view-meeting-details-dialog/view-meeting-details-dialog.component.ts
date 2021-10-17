import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-view-meeting-details-dialog',
  templateUrl: './view-meeting-details-dialog.component.html',
  styleUrls: ['./view-meeting-details-dialog.component.css'],
})
export class ViewMeetingDetailsDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ViewMeetingDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
