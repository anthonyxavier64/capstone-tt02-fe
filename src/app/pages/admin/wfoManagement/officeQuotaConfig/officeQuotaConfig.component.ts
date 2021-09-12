import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-office-quota-config',
  templateUrl: './officeQuotaConfig.component.html',
  styleUrls: ['./officeQuotaConfig.component.css'],
})
export class OfficeQuotaConfigComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit(): void {}

  onBackClick() {
    this._location.back();
  }
}
