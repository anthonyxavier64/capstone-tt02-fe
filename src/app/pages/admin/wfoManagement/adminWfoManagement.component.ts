import { BooleanInput } from '@angular/cdk/coercion';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from './../../../services/company/company-details.service';

@Component({
  selector: 'app-admin-wfoManagement',
  templateUrl: './adminWfoManagement.component.html',
  styleUrls: ['./adminWfoManagement.component.css'],
  providers: [MessageService],
})
export class AdminWfoManagementComponent implements OnInit {
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

    if (currentUser) {
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;
          this.companyWfoConfigType = this.company.wfoArrangement;
          console.log(this.company);

          if (this.companyWfoConfigType === 'OFFICE_QUOTAS') {
            this.officeQuotaConfig = this.company.officeQuotaConfiguration;
          } else if (this.companyWfoConfigType === 'ALTERNATE_WORK_TEAMS') {
            this.alternateWorkTeamsConfig =
              this.company.alternateWorkTeamsConfig;
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
  templateUrl: './noOptionSelected.component.html',
  styleUrls: ['./noOptionSelected.component.css'],
})
export class NoOptionSelectedDialog {
  constructor(public dialogRef: MatDialogRef<NoOptionSelectedDialog>) {}

  onCloseClick() {
    this.dialogRef.close();
  }
}
