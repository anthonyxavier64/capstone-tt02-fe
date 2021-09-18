import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-companyDetailsManagement',
  templateUrl: './adminCompanyDetailsManagement.component.html',
  styleUrls: ['./adminCompanyDetailsManagement.component.css'],
  providers: [MessageService],
})
export class AdminCompanyDetailsManagementComponent implements OnInit {
  company: any | undefined;
  editDetailsMode: boolean = false;

  constructor(
    private router: Router,
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
    this.router.navigateByUrl('/admin');
  }

  toggleEditDetails() {
    this.editDetailsMode = !this.editDetailsMode;
  }

  saveEditDetails() {
    this.companyDetailsService.updateCompany(this.company).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company details have been updated.',
        });
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
}
