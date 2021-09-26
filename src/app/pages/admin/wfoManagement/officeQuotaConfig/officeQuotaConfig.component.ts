import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import { OfficeQuotaConfigurationService } from 'src/app/services/wfoConfiguration/office-quota-configuration/office-quota-configuration.service';
@Component({
  selector: 'app-admin-office-quota-config',
  templateUrl: './officeQuotaConfig.component.html',
  styleUrls: ['./officeQuotaConfig.component.css'],
  providers: [MessageService],
})
export class OfficeQuotaConfigComponent implements OnInit {
  company: any | null;
  officeQuotaConfigId: number;
  officeQuotaConfig: any | null;

  numEmployeesPerDay: number;
  numDaysAllowedPerMonth: number;

  constructor(
    private _location: Location,
    private fb: FormBuilder,
    private messageService: MessageService,
    private companyDetailsService: CompanyDetailsService,
    private officeQuotaConfigurationService: OfficeQuotaConfigurationService
  ) {
    if (this.officeQuotaConfig === null) {
      this.numDaysAllowedPerMonth = 0;
      this.numDaysAllowedPerMonth = 0;
    }
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;
          if (this.company.officeQuotaConfigId === null) {
            this.officeQuotaConfig = null;
          } else {
            //INSERT OFFICE QUOTA CONFIG SERVICE HERE
            // this.officeQuotaConfig =
          }
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

  onBackClick() {
    this._location.back();
  }

  createNewOfficeConfig(officeQuotaConfigForm: NgForm) {
    const formValues = officeQuotaConfigForm.value;
    console.log(formValues);
    const newOfficeQuotaConfigForm = {
      numEmployeesPerDay: formValues.numEmployeesPerDay,
      numDaysAllowedPerMonth: formValues.numDaysAllowedPerMonth,
    };

    this.officeQuotaConfigurationService
      .createOfficeQuotaConfiguration(newOfficeQuotaConfigForm)
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Office Quota Configuration has been added.',
          });

          const updateCompany = {
            ...this.company,
            officeQuotaConfigurationId:
              response.officeQuotaConfig.officeQuotaConfigurationId,
          };
          console.log(updateCompany);
          this.companyDetailsService.updateCompany(updateCompany).subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail:
                  'Office Quota Configuration has been binded to the company.',
              });

              console.log(response);
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Problem adding configuration. Please try again.',
              });
            }
          );
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Problem adding configuration. Please try again.',
          });
        }
      );
  }

  submit(officeQuotaConfigForm: NgForm) {
    if (this.officeQuotaConfigId === null) {
      this.createNewOfficeConfig(officeQuotaConfigForm);
    } else {
    }
  }
}
