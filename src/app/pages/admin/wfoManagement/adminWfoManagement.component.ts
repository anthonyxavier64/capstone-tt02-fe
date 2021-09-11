import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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
  constructor(private _location: Location) {
    this.altWorkTeamSelectBtn = 'selectButton';
    this.officeQuotaSelectBtn = 'selectButton';
    this.altWorkTeamsSelection = 'wfoSelection';
    this.officeQuotaSelection = 'wfoSelection';
  }

  ngOnInit(): void {}

  onBackClick() {
    this._location.back();
  }

  onAltWorkTeamSelectClick() {
    this.altWorkTeamSelectBtn = 'selectedButton';
    this.altWorkTeamsSelection = 'selectedWfoSelection';
    this.officeQuotaSelectBtn = 'selectButton';
    this.officeQuotaSelection = 'wfoSelection';
  }

  onOfficeQuotaSelectClick() {
    this.officeQuotaSelectBtn = 'selectedButton';
    this.officeQuotaSelection = 'selectedWfoSelection';
    this.altWorkTeamSelectBtn = 'selectButton';
    this.altWorkTeamsSelection = 'wfoSelection';
  }
}
