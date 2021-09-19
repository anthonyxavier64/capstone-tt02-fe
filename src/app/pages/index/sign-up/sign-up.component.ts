import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanyDetailsDialogComponent } from './company-details-dialog/company-details-dialog.component';
import { TierInfoDialogComponent } from './tier-info-dialog/tier-info-dialog.component';

export interface CompanyDetailsDialogData {
  subscriptionType: string;
  paymentMethod: string;
  name: string;
  email: string;
<<<<<<< HEAD
  contactNumber: string;
  numOfEmployees: number;
  officeAddress: string;
  officeName: string;
  officeOpeningHour: string;
  officeClosingHour: string;
  officeCapacity: number;
  companySize: string[];
=======
  description: string;
  companySize: number;
>>>>>>> 0fc1ca2 (refactor: naming of attributes)

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

  name: string;
  email: string;
<<<<<<< HEAD
  contactNumber: string;
  officeAddress: string;
  numOfEmployees: number;
  officeName: string;
  officeOpeningHour: string;
  officeClosingHour: string;
  officeCapacity: number;
  companySize: string[];
=======
  description: string;
  companySize: number;
>>>>>>> 0fc1ca2 (refactor: naming of attributes)

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
    this.companySize = ['Small', 'Medium', 'Large'];
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
      height: '40vw',
      data: {
        subscriptionType: this.selectedSubscriptionTier,
        paymentMethod: this.selectedPaymentMethod,
        name: this.name,
        email: this.email,
<<<<<<< HEAD
        contactNumber: this.contactNumber,
        officeAddress: this.officeAddress,
        numOfEmployees: this.numOfEmployees,
        officeName: this.officeName,
        officeOpeningHour: this.officeOpeningHour,
        officeClosingHour: this.officeClosingHour,
        officeCapacity: this.officeCapacity,
=======
        description: this.description,
>>>>>>> 0fc1ca2 (refactor: naming of attributes)
        companySize: this.companySize,

        creditCardNumber: this.creditCardNumber,
        cardHolderName: this.cardHolderName,
        cvv: this.cvv,
        dateOfExpiry: this.dateOfExpiry,
      },
    });
  }
}
