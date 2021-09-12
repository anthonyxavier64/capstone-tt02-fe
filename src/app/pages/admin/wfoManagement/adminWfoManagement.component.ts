import { BooleanInput } from '@angular/cdk/coercion';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-wfoManagement',
  templateUrl: './adminWfoManagement.component.html',
  styleUrls: ['./adminWfoManagement.component.css'],
})
export class AdminWfoManagementComponent implements OnInit {
  altWorkTeamSelectBtn: String;
  officeQuotaSelectBtn: String;
  altWorkTeamsSelection: String;
  officeQuotaSelection: String;
  isOfficeQuotaSelectBtnClicked: BooleanInput;
  isAltWorkTeamSelectBtnClicked: BooleanInput;
  isOfficeQuotaConfigured: Boolean;
  isAlternateWorkTeamConfigured: Boolean;

  constructor(private _location: Location, private dialog: MatDialog) {
    this.altWorkTeamSelectBtn = 'selectButton';
    this.officeQuotaSelectBtn = 'selectButton';
    this.altWorkTeamsSelection = 'wfoSelection';
    this.officeQuotaSelection = 'wfoSelection';
    this.isOfficeQuotaSelectBtnClicked = false;
    this.isAltWorkTeamSelectBtnClicked = false;
    this.isOfficeQuotaConfigured = false;
    this.isAlternateWorkTeamConfigured = false;
  }

  ngOnInit(): void {}

  onBackClick() {
    this._location.back();
  }

  onAltWorkTeamSelectClick() {
    if (this.isAlternateWorkTeamConfigured) {
      this.isAltWorkTeamSelectBtnClicked = true;
      this.isOfficeQuotaSelectBtnClicked = false;
      this.altWorkTeamSelectBtn = 'selectedButton';
      this.altWorkTeamsSelection = 'selectedWfoSelection';
      this.officeQuotaSelectBtn = 'selectButton';
      this.officeQuotaSelection = 'wfoSelection';
    } else {
      this.dialog.open(NoOptionSelectedDialog, {
        width: '570px',
        height: '227px',
      });
    }
  }

  onOfficeQuotaSelectClick() {
    if (this.isOfficeQuotaConfigured) {
      this.isOfficeQuotaSelectBtnClicked = true;
      this.isAltWorkTeamSelectBtnClicked = false;
      this.officeQuotaSelectBtn = 'selectedButton';
      this.officeQuotaSelection = 'selectedWfoSelection';
      this.altWorkTeamSelectBtn = 'selectButton';
      this.altWorkTeamsSelection = 'wfoSelection';
    } else {
      this.dialog.open(NoOptionSelectedDialog, {
        width: '570px',
        height: '227px',
      });
    }
  }

  onConfigureOfficeQuotaClick() {
    this.isOfficeQuotaConfigured = true;
  }

  onConfigureAlternativeWorkTeamsClick() {
    this.isAlternateWorkTeamConfigured = true;
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
