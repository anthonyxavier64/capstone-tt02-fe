import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyDetailsDialogData } from '../sign-up.component';

@Component({
  selector: 'app-company-details-dialog',
  templateUrl: './company-details-dialog.component.html',
  styleUrls: ['./company-details-dialog.component.css'],
})
export class CompanyDetailsDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CompanyDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyDetailsDialogData
  ) {}

  ngOnInit(): void {}

  onSignUpClick(): void {
    // Pass data to back end from here
    this.dialogRef.close();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
