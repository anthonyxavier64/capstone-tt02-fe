import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tier-info-dialog',
  templateUrl: './tier-info-dialog.component.html',
  styleUrls: ['./tier-info-dialog.component.css'],
})
export class TierInfoDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<TierInfoDialogComponent>) {}

  ngOnInit(): void {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
