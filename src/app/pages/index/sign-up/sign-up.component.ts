import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanyDetailsDialogComponent } from './company-details-dialog/company-details-dialog.component';
import { TierInfoDialogComponent } from './tier-info-dialog/tier-info-dialog.component';

export interface CompanyDetailsDialogData {
  subscriptionTier: string;
  paymentMethod: string;
  companyName: string;
  companyEmail: string;
  companyDescription: string;
  numEmployees: number;

  creditCardNumber: string;
  cardHolderName: string;
  cvv: number;
  dateOfExpiry: Date;
}
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  subscriptionTiers: string[];
  paymentMethods: string[];

  selectedSubscriptionTier: string;
  selectedPaymentMethod: string;

  companyName: string;
  companyEmail: string;
  companyDescription: string;
  numEmployees: number;

  creditCardNumber: string;
  cardHolderName: string;
  cvv: number;
  dateOfExpiry: Date;

  constructor(
    public tierInfoDialog: MatDialog,
    public companyDetailsDialog: MatDialog
  ) {
    this.subscriptionTiers = ['Basic', 'Standard', 'Pro'];
    this.paymentMethods = ['Credit Card'];
  }

  ngOnInit(): void {}

  openTierInfo() {
    this.tierInfoDialog.open(TierInfoDialogComponent, {
      width: '60vw',
      height: '40vw',
    });
  }

  openCompanyDetailsDialog() {
    var dialogRef = this.tierInfoDialog.open(CompanyDetailsDialogComponent, {
      width: '60vw',
      height: '60vw',
      data: {
        subscriptionTier: this.selectedSubscriptionTier,
        paymentMethod: this.selectedPaymentMethod,
        companyName: this.companyName,
        companyEmail: this.companyEmail,
        companyDescription: this.companyDescription,
        numEmployees: this.numEmployees,

        creditCardNumber: this.creditCardNumber,
        cardHolderName: this.cardHolderName,
        cvv: this.cvv,
        dateOfExpiry: this.dateOfExpiry,
      },
    });
  }
}
