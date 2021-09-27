import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, NgModel } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import { OfficeQuotaConfigurationService } from 'src/app/services/wfoConfiguration/office-quota-configuration/office-quota-configuration.service';
import { UserService } from './../../../../services/user/user.service';
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
  isLoading: boolean;

  users: any | null;
  exceptions: any | null;
  selectedException: any | null;
  selectedExceptionWfoMonthlyAllocation: number;

  numEmployeesPerDay: number;
  numDaysAllowedPerMonth: number;

  constructor(
    private _location: Location,
    private fb: FormBuilder,
    private messageService: MessageService,
    private companyDetailsService: CompanyDetailsService,
    private officeQuotaConfigurationService: OfficeQuotaConfigurationService,
    private userService: UserService
  ) {
    if (this.officeQuotaConfig === null) {
      this.numDaysAllowedPerMonth = 0;
      this.numDaysAllowedPerMonth = 0;
    }
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.isLoading = true;
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;
          if (this.company.officeQuotaConfigurationId === null) {
            this.officeQuotaConfigId = null;
            this.isLoading = false;
          } else {
            this.officeQuotaConfigId = this.company.officeQuotaConfigurationId;

            this.officeQuotaConfigurationService
              .getOfficeQuotaConfiguration(this.officeQuotaConfigId)
              .subscribe((response) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Office Quota Configuration has been added.',
                });
                this.officeQuotaConfig = response.officeQuotaConfig;
                this.numEmployeesPerDay =
                  this.officeQuotaConfig.numEmployeesPerDay;
                this.numDaysAllowedPerMonth =
                  this.officeQuotaConfig.numDaysAllowedPerMonth;

                this.isLoading = false;
              });
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

      this.userService.getUsers().subscribe((response) => {
        this.users = response.users;
      });
    }
  }

  onBackClick() {
    this._location.back();
  }

  addException(
    selectedException: NgModel,
    selectedExceptionWfoMonthlyAllocation: NgModel
  ): void {
    const exception = {
      ...selectedException.value,
      wfoMonthlyAllocation: selectedExceptionWfoMonthlyAllocation.value,
    };
    console.log(exception);
  }

  createNewOfficeConfig(officeQuotaConfigForm: NgForm): void {
    const formValues = officeQuotaConfigForm.value;
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
          this.companyDetailsService.updateCompany(updateCompany).subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail:
                  'Office Quota Configuration has been binded to the company.',
              });
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

  updateOfficeQuotaConfig(officeQuotaConfigForm: NgForm): void {
    const formValues = officeQuotaConfigForm.value;
    const updatedOfficeQuotaConfig = {
      officeQuotaConfigurationId: this.officeQuotaConfigId,
      numEmployeesPerDay: formValues.numEmployeesPerDay,
      numDaysAllowedPerMonth: formValues.numDaysAllowedPerMonth,
    };

    this.officeQuotaConfigurationService
      .updateOfficeQuotaConfiguration(updatedOfficeQuotaConfig)
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Office Quota Configuration has been updated.',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Problem updating configuration. Please try again.',
          });
        }
      );
  }

  submit(officeQuotaConfigForm: NgForm) {
    if (this.officeQuotaConfigId === null) {
      this.createNewOfficeConfig(officeQuotaConfigForm);
    } else {
      this.updateOfficeQuotaConfig(officeQuotaConfigForm);
    }
  }
}
