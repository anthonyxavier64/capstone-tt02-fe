import { Component, OnInit, ViewChild } from '@angular/core';

import { Location } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-admin-employeeManagement',
  templateUrl: './adminEmployeeManagement.component.html',
  styleUrls: ['./adminEmployeeManagement.component.css'],
})
export class AdminEmployeeManagementComponent implements OnInit {
  currNewUserEmail: String;
  currNewUserPosition: String;
  allUsers: User[];

  displayedColumns: string[] = [
    'Name',
    'Email',
    'Employee S/N',
    'Contact Number',
    'Date Added',
  ];

  constructor(private _location: Location, private UserService: UserService) {}

  ngOnInit(): void {
    this.UserService.getUsers().subscribe(
      (response) => {
        this.allUsers = response;
      },
      (error) => {
        console.log(error);
      }
    );
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
