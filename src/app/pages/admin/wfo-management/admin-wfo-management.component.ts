import { BooleanInput } from '@angular/cdk/coercion';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from '../../../services/company/company-details.service';

@Component({
  selector: 'app-admin-wfoManagement',
  templateUrl: './admin-wfo-management.component.html',
  styleUrls: ['./admin-wfo-management.component.css'],
  providers: [MessageService],
})
export class AdminWfoManagementComponent implements OnInit {
  user: any | null;
  company: any | null;
  companyWfoConfigType: string;
  officeQuotaConfig: any | null;
  alternateWorkTeamsConfig: any | null;

  altWorkTeamSelectBtn: String;
  officeQuotaSelectBtn: String;
  altWorkTeamsSelection: String;
  officeQuotaSelection: String;
  isOfficeQuotaSelectBtnClicked: BooleanInput;
  isAltWorkTeamSelectBtnClicked: BooleanInput;
  isOfficeQuotaConfigured: Boolean;
  isAlternateWorkTeamConfigured: Boolean;

  constructor(
    private _location: Location,
    private dialog: MatDialog,
    private router: Router,
    private companyDetailsService: CompanyDetailsService,
    private messageService: MessageService
  ) {
    this.altWorkTeamSelectBtn = 'selectButton';
    this.officeQuotaSelectBtn = 'selectButton';
    this.altWorkTeamsSelection = 'wfoSelection';
    this.officeQuotaSelection = 'wfoSelection';
    this.isOfficeQuotaSelectBtnClicked = false;
    this.isAltWorkTeamSelectBtnClicked = false;
    this.isOfficeQuotaConfigured = false;
    this.isAlternateWorkTeamConfigured = false;
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    this.user = JSON.parse(currentUser);

    if (currentUser) {
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;
          this.companyWfoConfigType = this.company.wfoArrangement;
          console.log(this.company);

          if (
            this.companyWfoConfigType === 'OFFICE_QUOTAS' &&
            this.company.officeQuotaConfigurationId !== null
          ) {
            this.officeQuotaConfig = this.company.officeQuotaConfiguration;
            this.isOfficeQuotaSelectBtnClicked = true;
            this.isAltWorkTeamSelectBtnClicked = false;
            this.officeQuotaSelectBtn = 'selectedButton';
            this.officeQuotaSelection = 'selectedWfoSelection';
            this.altWorkTeamSelectBtn = 'selectButton';
            this.altWorkTeamsSelection = 'wfoSelection';
          } else if (
            this.companyWfoConfigType === 'ALTERNATE_WORK_TEAMS' &&
            this.company.alternateWorkTeamsConfigurationId !== null
          ) {
            this.alternateWorkTeamsConfig =
              this.company.alternateWorkTeamsConfig;

            this.isAltWorkTeamSelectBtnClicked = true;
            this.isOfficeQuotaSelectBtnClicked = false;
            this.altWorkTeamSelectBtn = 'selectedButton';
            this.altWorkTeamsSelection = 'selectedWfoSelection';
            this.officeQuotaSelectBtn = 'selectButton';
            this.officeQuotaSelection = 'wfoSelection';
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

  onAltWorkTeamSelectClick() {
    if (this.company.alternateWorkTeamsConfigurationId === null) {
      this.dialog.open(NoOptionSelectedDialog, {
        width: '50%',
        height: '30%',
      });
    } else {
      this.company.wfoArrangement = 'ALTERNATE_WORK_TEAMS';
      this.isAltWorkTeamSelectBtnClicked = true;
      this.isOfficeQuotaSelectBtnClicked = false;
      this.altWorkTeamSelectBtn = 'selectedButton';
      this.altWorkTeamsSelection = 'selectedWfoSelection';
      this.officeQuotaSelectBtn = 'selectButton';
      this.officeQuotaSelection = 'wfoSelection';

      this.companyDetailsService
        .updateCompanyWfoSelection(this.company)
        .subscribe(
          (response) => {
            console.log(response.returnObj);
            let usersNotified = response.returnObj.usersToNotify;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Work From Office Configuration has been updated.',
            });

            let uniqueUsersNotified = [];
            for (let userItem of usersNotified) {
              if (userItem.userId !== this.user.userId) {
                if (
                  uniqueUsersNotified.find(
                    (item) => item.userId === userItem.userId
                  ) === undefined
                ) {
                  uniqueUsersNotified.push(userItem);
                }
              }
            }
            for (let user of uniqueUsersNotified) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `${user.fullName} has been notified of the change.`,
              });
            }
          },
          (error) => {}
        );
    }
  }

  onOfficeQuotaSelectClick() {
    if (this.company.officeQuotaConfigurationId === null) {
      this.dialog.open(NoOptionSelectedDialog, {
        width: '50%',
        height: '30%',
      });
    } else {
      this.company.wfoArrangement = 'OFFICE_QUOTAS';
      this.isOfficeQuotaSelectBtnClicked = true;
      this.isAltWorkTeamSelectBtnClicked = false;
      this.officeQuotaSelectBtn = 'selectedButton';
      this.officeQuotaSelection = 'selectedWfoSelection';
      this.altWorkTeamSelectBtn = 'selectButton';
      this.altWorkTeamsSelection = 'wfoSelection';

      this.companyDetailsService
        .updateCompanyWfoSelection(this.company)
        .subscribe(
          (response) => {
            console.log(response.returnObj);
          },
          (error) => {}
        );
    }
  }

  onConfigureOfficeQuotaClick() {
    this.router.navigateByUrl('/officeQuotaConfig');
  }

  onConfigureAlternativeWorkTeamsClick() {
    this.router.navigateByUrl('/alternateWorkTeamsConfig');
  }
}

@Component({
  selector: 'dialog-no-option-selected',
  templateUrl: './no-option-selected.component.html',
  styleUrls: ['./no-option-selected.component.css'],
})
export class NoOptionSelectedDialog {
  constructor(public dialogRef: MatDialogRef<NoOptionSelectedDialog>) {}

  onCloseClick() {
    this.dialogRef.close();
  }
}
