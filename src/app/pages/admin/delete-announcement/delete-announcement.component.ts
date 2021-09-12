import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-announcement',
  templateUrl: './delete-announcement.component.html',
  styleUrls: ['./delete-announcement.component.css']
})
export class DeleteAnnouncementComponent implements OnInit {

  title: string | undefined;
  message: string | undefined;

  constructor(public dialogRef: MatDialogRef<DeleteAnnouncementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
