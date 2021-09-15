import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';

import { CompanyService } from '../../../services/company/company.service';

@Component({
  selector: 'app-admin-companyDetailsManagement',
  templateUrl: './adminCompanyDetailsManagement.component.html',
  styleUrls: ['./adminCompanyDetailsManagement.component.css'],
})

export class AdminCompanyDetailsManagementComponent implements OnInit {

  company: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
      private companyService: CompanyService) { 
  }

  ngOnInit() {
    this.companyService.getCompany().subscribe(
			response => {
				this.company = response;
			},
			error => {
				console.log('********** adminCompanyDetailsManagementComponent.ts: ' + error);
			}
		);
  }
  
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  onBackButtonClick() {
    this.router.navigateByUrl('/admin');
  }

  onEditCompanyDetailsClick() {
    this.router.navigateByUrl('/updateCompanyDetails');
  }

  onConfigureOfficeSpaceClick() {
    
  }

  onManageSubscriptionClick() {
    
  }
}
