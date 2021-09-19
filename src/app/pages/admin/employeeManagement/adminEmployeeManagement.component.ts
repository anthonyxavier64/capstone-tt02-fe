//import { UploadEmployeeCSVComponent } from '../dialogs/upload-employee-csv/upload-employee-csv.component';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DepartmentService } from 'src/app/services/department/department.service';
import { UserService } from 'src/app/services/user/user.service';
import { DepartmentInChargeOfComponent } from '../dialogs/department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from '../dialogs/department-part-of/department-part-of.component';

export interface EditEmployeeDialogData {
  userId: number;
  fullName: string;
  email: string;
  createdAt: string;
  contactNumber: string;
  isVaccinated: boolean;
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
    this.csvDownloadUrl =
      'https://firebasestorage.googleapis.com/v0/b/capstone-fe.appspot.com/o/mass_invite_employee_template.csv?alt=media&token=fdd9c480-c384-4c7b-a85e-89a3c32230a3';

    //Mock All Users Data
    this.allUsers = [
      {
        userId: 12345,
        fullName: 'user 1',
        email: '1@test.com',
        createdAt: '01/01/2021',
        contactNumber: '123',
        isVaccinated: true,
      },
      {
        userId: 123456,
        fullName: 'user 2',
        email: '2@test.com',
        createdAt: '01/01/2021',
        contactNumber: '123',
        isVaccinated: false,
      },
      {
        userId: 1234567,
        fullName: 'user 3',
        email: '3@test.com',
        createdAt: '01/01/2021',
        contactNumber: '123',
        isVaccinated: true,
      },
      {
        userId: 12345678,
        fullName: 'user 4',
        email: '4@test.com',
        createdAt: '01/01/2021',
        contactNumber: '123',
        isVaccinated: false,
      },
      {
        userId: 123456789,
        fullName: 'user 5',
        email: '5@test.com',
        createdAt: '01/01/2021',
        contactNumber: '123',
        isVaccinated: true,
      },
    ];
  }

  ngOnInit(): void {
    // Below is the correct code
    this.isLoading = false;
    this.userService.getUsers().subscribe(
      (response) => {
        this.allUsers = response.users;
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

  backButtonClicked() {
    this._location.back();
  }

  openInChargeOfDialog() {
    this.inChargeOfDepartments = [];
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

    let newUserId = null;
    this.userService.createNewUser(user).subscribe((response) => {
      newUserId = response.user.userId;
      console.log(newUserId);
      if (!newUserId) {
      } else {
        this.userService.sendVerificationEmail(newUserId);
      }
    });
  }
}
