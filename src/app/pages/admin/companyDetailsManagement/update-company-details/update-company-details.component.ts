import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CompanyService } from '../../../../services/company/company.service';

@Component({
  selector: 'app-update-company-details',
  templateUrl: './update-company-details.component.html',
  styleUrls: ['./update-company-details.component.css']
})
export class UpdateCompanyDetailsComponent implements OnInit {

  companyToUpdate: any;
  email: string | undefined;
  contactNumber: string | undefined;
  message: string | undefined;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
      private companyService: CompanyService) { 
  }

  ngOnInit() {
    this.companyService.getCompany().subscribe(
			response => {
				this.companyToUpdate = response;
			},
			error => {
				console.log('********** adminCompanyDetailsManagementComponent.ts: ' + error);
			}
		);
  }

  update(updateCompanyDetailsForm: NgForm) {
		
		if (updateCompanyDetailsForm.valid) {
			this.companyService.updateCompany(this.companyToUpdate).subscribe(
				response => {					
					this.message = "Company updated successfully";
				},
				error => {
					this.message = "An error has occurred while updating the company: " + error;
					
					console.log('********** updateCompanyDetailsComponent.ts: ' + error);
				}
			);
		}
	}

  onBackButtonClick() {
    this.router.navigateByUrl('/adminCompanyDetailsManagement');
  }

  onSaveCompanyDetailsClick() {
    
  }

  onConfigureOfficeSpaceClick() {
    
  }

  onManageSubscriptionClick() {
    
  }
  
}
