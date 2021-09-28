import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import { OfficeQuotaConfigurationService } from 'src/app/services/wfoConfiguration/office-quota-configuration/office-quota-configuration.service';
import { UserService } from './../../../../services/user/user.service';
import { EditExceptionDialogComponent } from './edit-exception-dialog/edit-exception-dialog.component';

export interface exceptionData {
  userId: number;
  fullName: string;
  wfoMonthlyAllocation: number;
}

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

  deletedExceptions: any[] = [];

  numEmployeesPerDay: number;
  numDaysAllowedPerMonth: number;

  constructor(
    private _location: Location,
    private fb: FormBuilder,
    private messageService: MessageService,
    private companyDetailsService: CompanyDetailsService,
    private officeQuotaConfigurationService: OfficeQuotaConfigurationService,
    private userService: UserService,
    public dialog: MatDialog
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
                this.officeQuotaConfig = response.officeQuotaConfig;
                this.numEmployeesPerDay =
                  this.officeQuotaConfig.numEmployeesPerDay;
                this.numDaysAllowedPerMonth =
                  this.officeQuotaConfig.numDaysAllowedPerMonth;
                this.exceptions = this.officeQuotaConfig.exceptions;

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

      this.userService.getUsers(companyId).subscribe((response) => {
        this.users = response.users;
      });
    }
  }

  onBackClick() {
    this._location.back();
  }

  addException(addExceptionForm: NgForm): void {
    const formValue = addExceptionForm.value;
    const selectedException = formValue.selectedException;
    const selectedExceptionWfoMonthlyAllocation =
      formValue.selectedExceptionWfoMonthlyAllocation;
    if (
      selectedExceptionWfoMonthlyAllocation <= 31 &&
      selectedExceptionWfoMonthlyAllocation >= 0
    ) {
      const exception = {
        userId: selectedException.userId,
        fullName: selectedException.fullName,
        wfoMonthlyAllocation: selectedExceptionWfoMonthlyAllocation,
      };

      //Logic to ensure that no repeated users in exceptions
      if (!this.exceptions.find((item) => item.userId === exception.userId)) {
        //Logic to add exception into exceptions array if it is valid
        if (!this.exceptions) {
          this.exceptions = [exception];
        } else {
          this.exceptions.push(exception);
        }

        //Logic to remove exception from deletedExceptions array for edge case of someone deleting the exception and readding them in
        if (
          this.deletedExceptions.find(
            (item) => item.userId === exception.userId
          )
        ) {
          const indexToRemove = this.deletedExceptions.indexOf(exception);
          this.deletedExceptions.splice(indexToRemove, 1);
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'This exception already exists.',
        });
      }
    }
  }

  editException(selectedException: any) {
    const editDialogRef = this.dialog.open(EditExceptionDialogComponent, {
      width: '70vw',
      height: '20vw',
      data: selectedException,
    });
  }

  deleteException(selectedException: any) {
    //Logic to store an array of deletedExceptions to reset deletedExceptions wfoMonthlyAllocation to default in update
    const indexToRemove = this.exceptions.indexOf(selectedException);
    this.exceptions.splice(indexToRemove, 1);
    this.deletedExceptions.push(selectedException);
  }

  createNewOfficeConfig(officeQuotaConfigForm: NgForm): void {
    const formValues = officeQuotaConfigForm.value;
    const newOfficeQuotaConfigForm = {
      numEmployeesPerDay: formValues.numEmployeesPerDay,
      numDaysAllowedPerMonth: formValues.numDaysAllowedPerMonth,
      exceptions: this.exceptions,
    };

    for (let exception of this.exceptions) {
      this.userService
        .updateUserDetailsByUserId(exception.userId, exception)
        .subscribe((response) => {});
    }
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
      exceptions: this.exceptions,
    };

    //Logic to update exception wfoMonthlyAllocation in the backend
    for (let exception of this.exceptions) {
      this.userService
        .updateUserDetailsByUserId(exception.userId, exception)
        .subscribe((response) => {});
    }

    //Logic to reset the wfoMonthlyAllocation for deletedException
    for (let deletedException of this.deletedExceptions) {
      const updatedDeletedException = {
        ...deletedException,
        wfoMonthlyAllocation: formValues.numDaysAllowedPerMonth,
      };
      this.userService
        .updateUserDetailsByUserId(
          deletedException.userId,
          updatedDeletedException
        )
        .subscribe((response) => {});
    }

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
