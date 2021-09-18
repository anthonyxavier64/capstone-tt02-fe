import { Component, OnInit, ViewChild } from '@angular/core';

import { GetAllEmployeesService } from 'src/app/services/user/get-all-employees.service';
import { Location } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-admin-employeeManagement',
  templateUrl: './adminEmployeeManagement.component.html',
  styleUrls: ['./adminEmployeeManagement.component.css'],
})
export class AdminEmployeeManagementComponent implements OnInit {
  currNewUserEmail: String;
  currNewUserPosition: String;
  allUsers: Array<User>;

  constructor(
    private _location: Location,
    private getAllUsersService: GetAllEmployeesService
  ) {}

  ngOnInit(): void {
    // this.getAllUsersService.getAllUsers().then((response) => {
    //   this.allUsers = JSON.parse(response);
    // });
  }
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  backButtonClicked() {
    this._location.back();
  }

  openInChargeOfDialog() {}

  openPartOfDialog() {}

  downloadCSVTemplate() {}

  uploadEmployeeCSV() {}
}
