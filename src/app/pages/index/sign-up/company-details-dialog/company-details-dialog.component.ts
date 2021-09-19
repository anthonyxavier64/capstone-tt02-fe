import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyDetailsDialogData } from '../sign-up.component';
import { MessageService } from 'primeng/api';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
  selector: 'app-company-details-dialog',
  templateUrl: './company-details-dialog.component.html',
  styleUrls: ['./company-details-dialog.component.css'],
  providers: [MessageService],
})
export class CompanyDetailsDialogComponent implements OnInit {
  companySizeArr: string[];

  constructor(
    public dialogRef: MatDialogRef<CompanyDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyDetailsDialogData,
    private companyService: CompanyService,
    private location: Location,
    private messageService: MessageService
  ) {
    this.companySizeArr = ['Small', 'Medium', 'Large'];
  }

  ngOnInit(): void {}

  onSignUpClick(): void {
    this.companyService.createCreationRequest(this.data).subscribe(
      (response) => {
        this.location.back();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to send request. Please try again.',
        });
      }
    );

    this.dialogRef.close();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
