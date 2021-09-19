import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyService } from 'src/app/services/company/company.service';
import { CompanyDetailsDialogData } from '../sign-up.component';

@Component({
  selector: 'app-company-details-dialog',
  templateUrl: './company-details-dialog.component.html',
  styleUrls: ['./company-details-dialog.component.css'],
})
export class CompanyDetailsDialogComponent implements OnInit {
  company: any | undefined;

  constructor(
    public dialogRef: MatDialogRef<CompanyDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyDetailsDialogData,
    private companyService: CompanyService
  ) {
    this.company = data;
  }

  ngOnInit(): void {}

  onSignUpClick(): void {
    // Pass data to back end from here

    this.companyService.createCreationRequest(this.company).subscribe(
      (response) => {},
      (error) => {}
    );

    this.dialogRef.close();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
