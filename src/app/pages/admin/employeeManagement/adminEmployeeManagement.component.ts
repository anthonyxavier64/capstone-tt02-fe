import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DepartmentInChargeOfComponent } from '../department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from '../department-part-of/department-part-of.component';
import { Location } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { UploadEmployeeCSVComponent } from '../upload-employee-csv/upload-employee-csv.component';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-admin-employeeManagement',
  templateUrl: './adminEmployeeManagement.component.html',
  styleUrls: ['./adminEmployeeManagement.component.css'],
  providers: [DialogService],
})
export class AdminEmployeeManagementComponent implements OnInit {
  currNewUserEmail: String;
  currNewUserPosition: String;
  ref: DynamicDialogRef | undefined;

  allUsers: User[];

  displayedColumns: string[] = [
    'Name',
    'Email',
    'Employee S/N',
    'Contact Number',
    'Date Added',
  ];

  constructor(
    private _location: Location,
    private UserService: UserService,
    private dialogService: DialogService
  ) {}

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

  openInChargeOfDialog() {
    this.ref = this.dialogService.open(DepartmentInChargeOfComponent, {
      width: '70%',
      height: '100%',
    });
  }

  openPartOfDialog() {
    this.ref = this.dialogService.open(DepartmentPartOfComponent, {
      width: '70%',
      height: '100%',
    });
  }

  downloadCSVTemplate() {}

  openUploadCSVDialog() {
    this.ref = this.dialogService.open(UploadEmployeeCSVComponent, {
      width: '70%',
      height: '100%',
    });
  }
}
