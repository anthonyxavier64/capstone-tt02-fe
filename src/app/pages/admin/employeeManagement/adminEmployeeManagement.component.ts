import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DepartmentService } from 'src/app/services/department/department.service';
import { UserService } from 'src/app/services/user/user.service';
import { DepartmentInChargeOfComponent } from '../dialogs/department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from '../dialogs/department-part-of/department-part-of.component';
import { ArtDialogComponent } from './art-test-results-dialog/art-test-dialog.component';
import { DeleteEmployeeDialogComponent } from './delete-employee-dialog/delete-employee-dialog.component';
import { EditEmployeeDialogComponent } from './edit-employee-dialog/edit-employee-dialog.component';
import { ShnDeclarationDialogComponent } from './shn-declaration-dialog/shn-declaration-dialog.component';
import { UploadVaccinationDialogComponent } from './upload-vaccination-dialog/upload-vaccination-dialog.component';

export interface user {
  userId: number;
  fullName: string;
  email: string;
  createdAt: string;
  contactNumber: string;
  isActivated: boolean;
}
@Component({
  selector: 'app-admin-employeeManagement',
  templateUrl: './adminEmployeeManagement.component.html',
  styleUrls: ['./adminEmployeeManagement.component.css'],
  providers: [MatDialog],
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

  artTestDialogRef: DynamicDialogRef;
  shnDeclarationDialogRef: DynamicDialogRef;
  editDialogRef: DynamicDialogRef;
  deleteDialogRef: DynamicDialogRef;
  selectedEmployee: any;

  constructor(
    private _location: Location,
    private userService: UserService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    public dialogService: DialogService
  ) {
    this.sortField = '';
    this.partOfDepartments = [];
    this.inChargeOfDepartments = [];
    this.allDepartments = [];
    this.csvDownloadUrl =
      'https://firebasestorage.googleapis.com/v0/b/capstone-fe.appspot.com/o/mass_invite_employee_template.csv?alt=media&token=fdd9c480-c384-4c7b-a85e-89a3c32230a3';

    //Mock All Users Data
    this.allUsers = [];
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    // Below is the correct code
    // this.isLoading = false;
    this.userService.getUsers(this.user.companyId).subscribe(
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
    //   this.allDepartments = JSON.parse(deptLocalStorage);
    //   console.log(this.allDepartments);
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

  onBackClick() {
    this._location.back();
  }

  openInChargeOfDialog() {
    const deptInChargeOfDialogRef = this.dialog.open(
      DepartmentInChargeOfComponent,
      {
        width: '50%',
        height: '50%',
        data: { inChargeOfDepartments: this.inChargeOfDepartments },
      }
    );

    deptInChargeOfDialogRef.afterClosed().subscribe((result) => {
      this.inChargeOfDepartments = result;
    });
  }

  openPartOfDialog() {
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

    let newUserId = null;
    this.userService.createNewUser(user).subscribe((response) => {
      newUserId = response.user.userId;
      if (!newUserId) {
      } else {
        this.ngOnInit();
      }
    });
  }
  openArtTestDialog(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
  }) {
    this.artTestDialogRef = this.dialogService.open(ArtDialogComponent, {
      header: selectedUser.fullName + "'s ART Tests",
      width: '70%',
      contentStyle: { 'max-height': '50vw', overflow: 'auto' },
      data: selectedUser,
    });

    this.artTestDialogRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }
  openShnDeclarationDialog(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
  }) {
    this.shnDeclarationDialogRef = this.dialogService.open(
      ShnDeclarationDialogComponent,
      {
        header: selectedUser.fullName + "'s SHN/QO Declaration",
        width: '70%',
        contentStyle: { 'max-height': '50vw', overflow: 'auto' },
        data: selectedUser,
      }
    );

    this.shnDeclarationDialogRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }
  openVaccinationDialog(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
  }) {
    this.shnDeclarationDialogRef = this.dialogService.open(
      UploadVaccinationDialogComponent,
      {
        header: selectedUser.fullName + "'s Vaccination Certificate",
        width: '70%',
        contentStyle: { 'max-height': '50vw', overflow: 'auto' },
        data: selectedUser,
      }
    );

    this.shnDeclarationDialogRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }

  openEditEmployeeDialog(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
  }) {
    this.editDialogRef = this.dialogService.open(EditEmployeeDialogComponent, {
      header: selectedUser.fullName + ' (' + selectedUser.userId + ')',
      width: '70%',
      contentStyle: { 'max-height': '50vw', overflow: 'auto' },
      data: selectedUser,
    });

    this.editDialogRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }

  onDeleteEmployeeClick(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
  }) {
    this.deleteDialogRef = this.dialogService.open(
      DeleteEmployeeDialogComponent,
      {
        header:
          'Delete Employee ' +
          selectedUser.fullName +
          ' (' +
          selectedUser.userId +
          ')',
        width: '30%',
        contentStyle: { 'max-height': '20vw', overflow: 'auto' },
        data: { selectedUser, confirmDelete: false },
      }
    );

    this.deleteDialogRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }
}
