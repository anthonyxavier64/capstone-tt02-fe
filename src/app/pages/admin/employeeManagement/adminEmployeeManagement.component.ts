import { Component, OnInit, ViewChild } from '@angular/core';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

import { DepartmentInChargeOfComponent } from '../dialogs/department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from '../dialogs/department-part-of/department-part-of.component';
import { DepartmentService } from 'src/app/services/department/department.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { UploadEmployeeCSVComponent } from '../dialogs/upload-employee-csv/upload-employee-csv.component';
import { UserService } from 'src/app/services/user/user.service';
import { firebaseStorage } from '../../../../firebase/firebase';

@Component({
  selector: 'app-admin-employeeManagement',
  templateUrl: './adminEmployeeManagement.component.html',
  styleUrls: ['./adminEmployeeManagement.component.css'],
})
export class AdminEmployeeManagementComponent implements OnInit {
  user;

  currNewUserEmail: String;
  currNewUserPosition: String;
  currNewUserFullName: String;
  currNewUserContactNumber: String;

  isLoading: boolean = false;
  sortField: string;

  partOfDepartments: any[];
  inChargeOfDepartments: any[];

  allDepartments: any;
  allUsers: any;

  csvDownloadUrl: string;

  constructor(
    private _location: Location,
    private userService: UserService,
    private departmentService: DepartmentService,
    private dialog: MatDialog
  ) {
    this.sortField = '';
    this.partOfDepartments = [];
    this.inChargeOfDepartments = [];
    this.allDepartments = [];
    this.allUsers = [];
    this.csvDownloadUrl =
      'https://firebasestorage.googleapis.com/v0/b/capstone-fe.appspot.com/o/mass_invite_employee_template.csv?alt=media&token=fdd9c480-c384-4c7b-a85e-89a3c32230a3';
  }

  ngOnInit(): void {
    // Below is the correct code
    this.isLoading = true;
    this.userService.getUsers().subscribe(
      (response) => {
        this.allUsers = response.types.users;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
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
    this.inChargeOfDepartments = [];
    const deptPartOfDialogRef = this.dialog.open(DepartmentPartOfComponent, {
      width: '50%',
      height: '50%',
      data: { inChargeOfDepartments: this.inChargeOfDepartments },
    });

    deptPartOfDialogRef.afterClosed().subscribe((result) => {
      this.inChargeOfDepartments = result;
    });
    // How to attach departments to user?
  }

  // Currently working on
  openPartOfDialog() {
    this.partOfDepartments = [];
    const deptPartOfDialogRef = this.dialog.open(DepartmentPartOfComponent, {
      width: '50%',
      height: '50%',
      data: { partOfDepartments: this.partOfDepartments },
    });

    deptPartOfDialogRef.afterClosed().subscribe((result) => {
      this.partOfDepartments = result;
    });
  }

  downloadCSVTemplate() {
    window.open(this.csvDownloadUrl, '_self');
  }

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

  createNewEmployee() {
    var currCompanyId = -1;
    var currUserJson = localStorage.getItem('currentUser');
    if (currUserJson != null) {
      let currUser = JSON.parse(currUserJson);
      currCompanyId = currUser.companyId;
    }

    let deptsInChargeOfIds = [];
    let deptsPartOfIds = [];

    for (let dept of this.inChargeOfDepartments) {
      deptsInChargeOfIds.push(dept.departmentId);
    }

    for (let dept of this.partOfDepartments) {
      deptsPartOfIds.push(dept.departmentId);
    }

    let user = {
      email: this.currNewUserEmail,
      fullName: this.currNewUserFullName,
      company: { companyId: currCompanyId },
      password: 'password',
      contactNumber: this.currNewUserContactNumber,
      deptsInChargeOf: { deptsInChargeOf: deptsInChargeOfIds },
      deptsPartOf: { deptsPartOf: deptsPartOfIds },
    };

    console.log(JSON.stringify(user));

    this.userService.createNewUser(user);
  }
}
