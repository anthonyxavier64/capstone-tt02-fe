import { MessageService } from 'primeng/api';

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CompanyDetailsDialogComponent } from './company-details-dialog/company-details-dialog.component';
import { TierInfoDialogComponent } from './tier-info-dialog/tier-info-dialog.component';

export interface CompanyDetailsDialogData {
  subscriptionType: string;
  paymentMethod: string;
  name: string;
  email: string;
  contactNumber: string;
  numOfEmployees: number;
  officeAddress: string;
  officeName: string;
  officeOpeningHour: string;
  officeClosingHour: string;
  officeCapacity: number;
  companySize: string;
  hrAdminEmail: string;
  hrAdminFullName: string;
  creditCardNumber: string;
  cardHolderName: string;
  cvv: number;
  CCDateOfExpiry: Date;
}
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [MessageService],
})
export class SignUpComponent implements OnInit {
  subscriptionTiers: string[];
  paymentMethods: string[];

  selectedSubscriptionTier: string;
  selectedPaymentMethod: string;

  name: string;
  email: string;
  contactNumber: string;
  officeAddress: string;
  numOfEmployees: number;
  officeName: string;
  officeOpeningHour: string;
  officeClosingHour: string;
  officeCapacity: number;
  companySize: string;

  creditCardNumber: string;
  cardHolderName: string;
  cvv: number;
  CCDateOfExpiry: Date;

  hrAdminFullName: string;
  hrAdminEmail: string;

  constructor(
    public tierInfoDialog: MatDialog,
    public companyDetailsDialog: MatDialog,
    private messageService: MessageService
  ) {
    this.subscriptionTiers = ['Basic', 'Standard', 'Pro'];
    this.paymentMethods = ['Credit Card'];
  }

  ngOnInit(): void {}

  openTierInfo() {
    this.tierInfoDialog.open(TierInfoDialogComponent, {
      width: '80%',
      height: '90%',
    });
  }

  openCompanyDetailsDialog(emailText: any) {
    if (
      this.name &&
      this.email &&
      emailText.valid &&
      this.selectedSubscriptionTier &&
      this.paymentMethods
    ) {
      var dialogRef = this.tierInfoDialog.open(CompanyDetailsDialogComponent, {
        width: '75%',
        height: '90%',
        data: {
          subscriptionType: this.selectedSubscriptionTier,
          paymentMethod: this.selectedPaymentMethod,
          name: this.name,
          email: this.email,
          contactNumber: this.contactNumber,
          officeAddress: this.officeAddress,
          numOfEmployees: this.numOfEmployees,
          officeName: this.officeName,
          officeOpeningHour: this.officeOpeningHour,
          officeClosingHour: this.officeClosingHour,
          officeCapacity: this.officeCapacity,
          companySize: this.companySize,

          creditCardNumber: this.creditCardNumber,
          cardHolderName: this.cardHolderName,
          cvv: this.cvv,
          CCDateOfExpiry: this.CCDateOfExpiry,

          hrAdminEmail: this.hrAdminEmail,
          hrAdminFullName: this.hrAdminFullName,
        },
      });

      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result.action === 'SUCCESS') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Company sign-up success!',
            });
        } else if (result.action === 'ERROR') {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error in company sign-up. Please try again.',
          });
        }
      });

    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please ensure that you have filled in all fields correctly.',
      });
    }
  }
}
