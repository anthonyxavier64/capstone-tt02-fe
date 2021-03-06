import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SubscriptionDialogComponent } from '../subscription/subscription-dialog/subscription-dialog.component';
import { CreditcardDialogComponent } from '../creditcard/creditcard-dialog/creditcard-dialog.component';

@Component({
  selector: 'app-admin-companyDetailsManagement',
  templateUrl: './admin-company-details-management.component.html',
  styleUrls: ['./admin-company-details-management.component.css'],
  providers: [MessageService],
})
export class AdminCompanyDetailsManagementComponent implements OnInit {
  company: any | undefined;
  editDetailsMode: boolean = false;

  contactNumber: string;
  email: string;

  constructor(
    private router: Router,
    private location: Location,
    private companyDetailsService: CompanyDetailsService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;
          this.contactNumber = this.company.contactNumber;
          this.email = this.company.email;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Company not found',
          });
        }
      );
    }
  }

  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  handleBackButton() {
    this.location.back();
  }

  toggleEditDetails() {
    this.email = this.company.email;
    this.contactNumber = this.company.contactNumber;
    this.editDetailsMode = !this.editDetailsMode;
  }

  saveEditDetails() {
    this.company.email = this.email;
    this.company.contactNumber = this.contactNumber;
    this.companyDetailsService.updateCompany(this.company).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company details have been updated.',
        });
        this.toggleEditDetails();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to update company details. Please try again.',
        });
      }
    );
  }

  handleConfigureOfficeSpace() {
    this.router.navigate(['officeSpaceConfig'], {
      state: this.company.companyId,
    });
  }

  handleManageBlockoutDate() {
    this.router.navigate(['manage-blockout-date'], {
      state: this.company.companyId,
    });
  }

  onEmailTextChange(emailText: any) {
    console.log(emailText);
  }

  handleManageSubscription() {
    const dialogRef = this.dialog.open(SubscriptionDialogComponent, {
      width: '250px',
      data: {
        subscriptionType: this.company.subscriptionType,
        companyId: this.company.companyId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Subscription Tier has been updated.',
        });

        this.company.subscriptionType = result;
      }
    });
  }

  handleEditCC() {
    const creditCard = {
      CCDateOfExpiry: this.company.CCDateOfExpiry,
      creditCardNumber: this.company.creditCardNumber,
      cvv: this.company.cvv,
      cardHolderName: this.company.cardHolderName,
    };

    const dialogRef = this.dialog.open(CreditcardDialogComponent, {
      width: '500px',
      data: {
        creditCard,
        companyId: this.company.companyId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Credit card has been updated.',
        });

        this.company.CCDateOfExpiry = result.CCDateOfExpiry;
        this.company.creditCardNumber = result.creditCardNumber;
        this.company.cvv = result.cvv;
        this.company.cardHolderName = result.cardHolderName;
      }
    });
  }
}
