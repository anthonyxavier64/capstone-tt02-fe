import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';

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
    private messageService: MessageService
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

  onEmailTextChange(emailText: any) {
    console.log(emailText);
  }
}
