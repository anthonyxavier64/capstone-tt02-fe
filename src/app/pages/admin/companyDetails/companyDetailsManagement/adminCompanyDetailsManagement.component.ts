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

  constructor(
    private router: Router,
    private companyDetailsService: CompanyDetailsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const { companyId } = JSON.parse(localStorage.getItem('currentUser'));
    this.companyDetailsService.getCompanyById('1').subscribe(
      (result) => {},
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Company not found',
        });
      }
    );
  }

  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  handleBackButton() {
    this.router.navigateByUrl('/admin');
  }
}
