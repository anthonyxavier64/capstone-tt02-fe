import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

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
  providers: [DialogService],
})
export class AdminEmployeeManagementComponent implements OnInit {
  currNewUserEmail: String;
  currNewUserPosition: String;
  // ref: DynamicDialogRef | undefined;

  isLoading: boolean = false;
  sortField: string;

  departments: any[];
  allUsers: any[];

  constructor(
    private _location: Location,
    private userService: UserService,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) {
    this.sortField = '';
  }

  ngOnInit(): void {
    // Below is the correct code
    this.isLoading = true;
    // this.userService.getUsers().subscribe(
    //   (response) => {
    //     this.allUsers = response;
    //     console.log(this.allUsers[0].fullName);
    //     this.isLoading = false;
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    // Below is for when the DB is unaccessible
    var deptLocalStorage = localStorage.getItem('allDepts');
    if (deptLocalStorage != null) {
      this.departments = JSON.parse(deptLocalStorage);
    }
    var userLocalStorage = localStorage.getItem('allUsers');
    if (userLocalStorage != null) {
      this.allUsers = JSON.parse(userLocalStorage);
      this.isLoading = false;
    }
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
    let deptPartOfDialogRef = this.dialog.open(DepartmentPartOfComponent, {
      width: '50%',
      height: '50%',
    });
    // How to attach departments to user?
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
