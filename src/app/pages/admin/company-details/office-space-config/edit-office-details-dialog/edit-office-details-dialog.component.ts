import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';

@Component({
  selector: 'app-edit-office-details-dialog',
  templateUrl: './edit-office-details-dialog.component.html',
  styleUrls: ['./edit-office-details-dialog.component.css'],
  providers: [MessageService],
})
export class EditOfficeDetailsDialogComponent implements OnInit {
  company: any;

  officeName: string;
  officeAddress: string;
  officeOpeningHour: string;
  officeClosingHour: string;

  constructor(
    public dialogRef: MatDialogRef<EditOfficeDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private companyDetailsService: CompanyDetailsService,
    private messageService: MessageService
  ) {
    this.company = data.company;
    this.officeName = this.company.officeName;
    this.officeAddress = this.company.officeAddress;
    this.officeOpeningHour = this.company.officeOpeningHour.substring(0, 5);
    this.officeClosingHour = this.company.officeClosingHour.substring(0, 5);
  }

  ngOnInit(): void {}

  submitOfficeDetailsForm(officeDetailsForm: NgForm) {
    const officeDetails = officeDetailsForm.value;

    this.company.officeName = officeDetails.officeName;
    this.company.officeAddress = officeDetails.officeAddress;

    this.company.officeOpeningHour = officeDetails.openingHour;
    this.company.officeClosingHour = officeDetails.closingHour;

    this.companyDetailsService.updateCompany(this.company).subscribe(
      (response) => {
        this.company = response.company;
        this.dialogRef.close({ action: 'SUCCESS' });
      },
      (error) => {
        this.dialogRef.close({ action: 'ERROR' });
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close({ action: 'CLOSED' });
  }
}
