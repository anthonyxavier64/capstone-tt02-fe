import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-admin-office-quota-config',
  templateUrl: './officeQuotaConfig.component.html',
  styleUrls: ['./officeQuotaConfig.component.css'],
})
export class OfficeQuotaConfigComponent implements OnInit {
  employeeCounterValue: number;
  allEmployees: string[];
  selectedEmployee: String;
  wfoDaysLimit: number;
  exceptionDaysLimit: number;

  constructor(private _location: Location, private fb: FormBuilder) {
    var cachedMaxEmployees = localStorage.getItem(
      'officeQuotaConfigMaxEmployees'
    );
    console.log(cachedMaxEmployees);
    if (cachedMaxEmployees !== null) {
      this.employeeCounterValue = JSON.parse(cachedMaxEmployees);
    } else {
      this.employeeCounterValue = 0;
    }
    this.allEmployees = [
      'Nick',
      'Bob',
      'Sam',
      'Tom',
      'Alice',
      'Beatrice',
      'Barbara',
    ];
    this.wfoDaysLimit = 8;
    this.exceptionDaysLimit = 2;
  }

  ngOnInit(): void {}

  onBackClick() {
    this._location.back();
  }

  submit(value: any) {
    localStorage.setItem(
      'officeQuotaConfigMaxEmployees',
      JSON.stringify(this.employeeCounterValue)
    );
  }
}
