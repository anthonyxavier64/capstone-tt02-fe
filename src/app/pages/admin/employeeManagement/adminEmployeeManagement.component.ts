import { Component, OnInit, ViewChild } from '@angular/core';

import { DepartmentInChargeOfComponent } from '../dialogs/department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from '../dialogs/department-part-of/department-part-of.component';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { UploadEmployeeCSVComponent } from '../dialogs/upload-employee-csv/upload-employee-csv.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-admin-employeeManagement',
  templateUrl: './adminEmployeeManagement.component.html',
  styleUrls: ['./adminEmployeeManagement.component.css'],
})
export class AdminEmployeeManagementComponent implements OnInit {
  currNewUserEmail: String;
  currNewUserPosition: String;

  isLoading: boolean = false;
  sortField: string;

  partOfDepartments: any[];
  inChargeOfDepartments: any[];

  allDepartments: any[];
  allUsers: any[];

  constructor(
    private _location: Location,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.sortField = '';
    this.partOfDepartments = [];
    this.inChargeOfDepartments = [];
    this.allDepartments = [];
    this.allUsers = [];
  }

  ngOnInit(): void {
    // Below is the correct code
    this.isLoading = true;
    this.userService.getUsers().subscribe(
      (response) => {
        this.allUsers = response.users;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );

    // Below is for when the DB is unaccessible

    // var deptLocalStorage = localStorage.getItem('allDepts');
    // if (deptLocalStorage != null) {
    //   this.departments = JSON.parse(deptLocalStorage);
    // }
    // var userLocalStorage = localStorage.getItem('allUsers');
    // if (userLocalStorage != null) {
    //   this.allUsers = JSON.parse(userLocalStorage);
    //   this.isLoading = false;
    // }
  }
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  backButtonClicked() {
    this._location.back();
  }

  openInChargeOfDialog() {
    // const deptInChargeOfDialogRef = this.dialogService.open(
    //   DepartmentInChargeOfComponent,
    //   {
    //     width: '50%',
    //     height: '50%',
    //   }
    // );
    // How to attach departments to user?
  }

  // Currently working on
  openPartOfDialog() {
    console.log('PartOfClicked');
    this.partOfDepartments = [];
    const deptPartOfDialogRef = this.dialog.open(DepartmentPartOfComponent, {
      width: '50%',
      height: '50%',
      data: { partOfDepartments: this.partOfDepartments },
    });

    deptPartOfDialogRef.afterClosed().subscribe((result) => {
      this.partOfDepartments = result.partOfDepartments;
    });
  }

  downloadCSVTemplate() {}

  openUploadCSVDialog() {
    // const uploadEmployeeCSVDialogRef = this.dialogService.open(
    //   UploadEmployeeCSVComponent,
    //   {
    //     width: '70%',
    //     height: '100%',
    //   }
    // );
    // uploadEmployeeCSVDialogRef.onClose.subscribe();
  }
}
