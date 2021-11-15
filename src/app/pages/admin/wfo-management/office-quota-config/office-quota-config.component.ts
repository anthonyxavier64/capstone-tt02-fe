import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { OfficeQuotaConfigurationService } from 'src/app/services/wfoConfiguration/officeQuotaConfiguration/office-quota-configuration.service';
import { UserService } from '../../../../services/user/user.service';
import { EditExceptionDialogComponent } from './edit-exception-dialog/edit-exception-dialog.component';

export interface exceptionData {
  userId: number;
  fullName: string;
  wfoMonthlyAllocation: number;
}

@Component({
  selector: 'app-admin-office-quota-config',
  templateUrl: './office-quota-config.component.html',
  styleUrls: ['./office-quota-config.component.css'],
  providers: [MessageService],
})
export class OfficeQuotaConfigComponent implements OnInit {
  user: any;
  company: any | null;
  officeQuotaConfigId: number;
  officeQuotaConfig: any | null;
  isLoading: boolean;

  users: any[] = [];
  exceptions: any | null;
  selectedException: any | null;
  selectedExceptionWfoMonthlyAllocation: number;

  deletedExceptions: any[] = [];

  numEmployeesPerDay: number;
  numDaysAllowedPerMonth: number;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private companyDetailsService: CompanyDetailsService,
    private officeQuotaConfigurationService: OfficeQuotaConfigurationService,
    private userService: UserService,
    private meetingService: MeetingService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      this.user = JSON.parse(currentUser);
      const { companyId } = this.user;
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        async (result) => {
          this.company = result.company;
          if (this.company.officeQuotaConfigurationId === null) {
            this.officeQuotaConfigId = null;
            this.exceptions = [];
            this.deletedExceptions = [];
            this.numEmployeesPerDay = null;
            this.numDaysAllowedPerMonth = null;
            let users = await this.userService.getUsers(companyId).toPromise();
            this.users = users.users;
            for (let exception of this.exceptions) {
              if (this.users.find((item) => item.userId === exception.userId)) {
                const indexToRemove = this.users.findIndex(
                  (item) => item.userId === exception.userId
                );
                this.users.splice(indexToRemove, 1);
              }
            }
            this.isLoading = false;
          } else {
            this.officeQuotaConfigId = this.company.officeQuotaConfigurationId;

            let officeQuotaConfigResponse =
              await this.officeQuotaConfigurationService
                .getOfficeQuotaConfiguration(this.officeQuotaConfigId)
                .toPromise();

            this.officeQuotaConfig =
              officeQuotaConfigResponse.officeQuotaConfig;
            this.numEmployeesPerDay = this.officeQuotaConfig.numEmployeesPerDay;
            this.numDaysAllowedPerMonth =
              this.officeQuotaConfig.numDaysAllowedPerMonth;
            this.exceptions = this.officeQuotaConfig.exceptions;

            let users = await this.userService.getUsers(companyId).toPromise();
            this.users = users.users;
            for (let exception of this.exceptions) {
              if (this.users.find((item) => item.userId === exception.userId)) {
                const indexToRemove = this.users.findIndex(
                  (item) => item.userId === exception.userId
                );
                this.users.splice(indexToRemove, 1);
              }
            }

            this.isLoading = false;
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

  addException(addExceptionForm: NgForm): void {
    const formValue = addExceptionForm.value;
    const selectedException = formValue.selectedException;
    const selectedExceptionWfoMonthlyAllocation =
      formValue.selectedExceptionWfoMonthlyAllocation;
    if (
      selectedExceptionWfoMonthlyAllocation <= 31 &&
      selectedExceptionWfoMonthlyAllocation >= 0 &&
      selectedExceptionWfoMonthlyAllocation !== ''
    ) {
      const exception = {
        userId: selectedException.userId,
        fullName: selectedException.fullName,
        isVaccinated: selectedException.isVaccinated,
        isInfected: selectedException.isInfected,
        wfoMonthlyAllocation: selectedExceptionWfoMonthlyAllocation,
      };

      //Logic to ensure that no repeated users in exceptions
      if (
        !(
          this.exceptions.filter((item) => item.userId === exception.userId)
            .length > 0
        )
      ) {
        //Logic to add exception into exceptions array if it is valid
        if (!this.exceptions) {
          this.exceptions = [exception];
          const indexToRemove = this.users.findIndex(
            (item) => item.userId === exception.userId
          );
          this.users.splice(indexToRemove, 1);
        } else {
          this.exceptions.push(exception);

          const indexToRemove = this.users.findIndex(
            (item) => item.userId === exception.userId
          );
          this.users.splice(indexToRemove, 1);
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
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid exception.',
      });
    }
  }

  editException(selectedException: any) {
    const editDialogRef = this.dialog.open(EditExceptionDialogComponent, {
      width: '70vw',
      height: '20vw',
      data: selectedException,
    });
  }

  updateUserWFoAllowance(newUser: any) {
    if (this.user.wfoMonthlyAllocation < newUser.wfoMonthlyAllocation) {
    }
    this.user = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  }

  deleteException(selectedException: any) {
    //Logic to store an array of deletedExceptions to reset deletedExceptions wfoMonthlyAllocation to default in update
    const indexToRemove = this.exceptions.indexOf(selectedException);
    this.exceptions.splice(indexToRemove, 1);
    this.deletedExceptions.push(selectedException);
    if (!this.users.find((item) => item.userId === selectedException.userId)) {
      this.users.push(selectedException);
      this.users.sort((a, b) => (a.userId < b.userId ? -1 : 1));
    }
  }

  createNewOfficeConfig(officeQuotaConfigForm: NgForm): void {
    const formValues = officeQuotaConfigForm.value;
    const newOfficeQuotaConfigForm = {
      companyId: this.company.companyId,
      numEmployeesPerDay: this.numEmployeesPerDay,
      numDaysAllowedPerMonth: this.numDaysAllowedPerMonth,
      exceptions: this.exceptions,
    };

    //Logic to set exception wfoMonthlyAllocation for exception users
    for (let exception of this.exceptions) {
      const indexToRemoveFromUsers = this.users.findIndex(
        (item) => item.userId === exception.userId
      );
      this.users.splice(indexToRemoveFromUsers, 1);
      this.userService
        .updateUserDetailsByUserId(exception.userId, exception)
        .subscribe((response) => {
          if (exception.userId === this.user.userId) {
            this.updateUserWFoAllowance(response.user);
          }
        });
    }

    //Logic to set default wfoMonthlyAllocation for users
    for (let user of this.users) {
      const updatedUser = {
        ...user,
        wfoMonthlyAllocation: formValues.numDaysAllowedPerMonth,
      };
      this.userService
        .updateUserDetailsByUserId(user.userId, updatedUser)
        .subscribe((response) => {
          if (user.userId === this.user.userId) {
            this.updateUserWFoAllowance(response.user);
          }
        });
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
            wfoArrangement: 'OFFICE_QUOTAS',
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
    //Logic to set default wfoMonthlyAllocation for users
    for (let user of this.users) {
      const updatedUser = {
        ...user,
        wfoMonthlyAllocation: formValues.numDaysAllowedPerMonth,
      };

      this.userService
        .updateUserDetailsByUserId(user.userId, updatedUser)
        .subscribe((response) => {
          if (user.userId === this.user.userId) {
            this.updateUserWFoAllowance(response.user);
          }
        });
    }
    //Logic to update exception wfoMonthlyAllocation in the backend
    for (let exception of this.exceptions) {
      this.userService
        .updateUserDetailsByUserId(exception.userId, exception)
        .subscribe((response) => {
          if (exception.userId === this.user.userId) {
            this.updateUserWFoAllowance(response.user);
          }
        });
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
        .subscribe((response) => {
          if (deletedException.userId === this.user.userId) {
            this.updateUserWFoAllowance(response.user);
          }
        });
    }

    this.officeQuotaConfigurationService
      .updateOfficeQuotaConfiguration(updatedOfficeQuotaConfig)
      .subscribe(
        (response) => {
          let usersNotified = response.responseObj.usersToNotify;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Office Quota Configuration has been updated.',
          });
          let uniqueUsersNotified = [...new Set(usersNotified)];
          for (let userId of uniqueUsersNotified) {
            if (userId !== this.user.userId) {
              let user = this.users.find((item) => item.userId === userId);
              if (user === undefined) {
                user = this.exceptions.find((item) => item.userId === userId);
              }
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `${user.fullName} has been notified of the change.`,
              });
            }
          }
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
    if (
      officeQuotaConfigForm.value.numEmployeesPerDay !== '' &&
      officeQuotaConfigForm.value.numDaysAllowedPerMonth !== ''
    ) {
      if (this.officeQuotaConfigId === null) {
        this.createNewOfficeConfig(officeQuotaConfigForm);
      } else {
        this.updateOfficeQuotaConfig(officeQuotaConfigForm);
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Problem updating configuration. Please ensure fields are not empty.',
      });
    }
  }
}
