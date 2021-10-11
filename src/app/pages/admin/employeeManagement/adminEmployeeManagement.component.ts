import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { DepartmentService } from 'src/app/services/department/department.service';
import { UserService } from 'src/app/services/user/user.service';
import { DepartmentInChargeOfComponent } from '../dialogs/department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from '../dialogs/department-part-of/department-part-of.component';
import { CompanyDetailsService } from './../../../services/company/company-details.service';
import { DeleteEmployeeDialogComponent } from './delete-employee-dialog/delete-employee-dialog.component';
import { DownloadCsvDialogComponent } from './download-csv-dialog/download-csv-dialog.component';
import { EditEmployeeDialogComponent } from './edit-employee-dialog/edit-employee-dialog.component';
import { MassInviteInfoDialogComponent } from './mass-invite-info-dialog/mass-invite-info-dialog.component';
import { ViewArtComponent } from './view-art-dialog/view-art-dialog.component';
import { ViewShnDeclarationDialog } from './view-shn-dialog/view-shn-dialog.component';
import { ViewVaccinationDialogComponent } from './view-vaccination-dialog/view-vaccination-dialog.component';

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
  providers: [MatDialog, MessageService],
})
export class AdminEmployeeManagementComponent implements OnInit {
  user;
  company: any | undefined;

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

  downloadCsvDialogRef: DynamicDialogRef;
  massInviteDialogRef: DynamicDialogRef;
  uploadProgress: number;
  showWarningMessage: boolean;

  artTestDialogRef: DynamicDialogRef;
  shnDeclarationDialogRef: DynamicDialogRef;
  vaccinationDialogRef: DynamicDialogRef;
  editDialogRef: DynamicDialogRef;
  deleteDialogRef: DynamicDialogRef;
  selectedEmployee: any;

  constructor(
    private _location: Location,
    private userService: UserService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    public dialogService: DialogService,
    private afStorage: AngularFireStorage,
    private companyDetailsService: CompanyDetailsService,
    private messageService: MessageService
  ) {
    this.sortField = '';
    this.partOfDepartments = [];
    this.inChargeOfDepartments = [];
    this.allDepartments = [];
    this.csvDownloadUrl =
      'https://firebasestorage.googleapis.com/v0/b/capstone-fe.appspot.com/o/mass_invite_employee_template.csv?alt=media&token=fdd9c480-c384-4c7b-a85e-89a3c32230a3';

    //Mock All Users Data
    this.allUsers = [];

    this.uploadProgress = -1;
    this.showWarningMessage = false;
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Company not found',
          });
        }
      );
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

    // deptInChargeOfDialogRef.afterClosed().subscribe((result) => {
    //   this.inChargeOfDepartments = result;
    // });
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
    this.downloadCsvDialogRef = this.dialogService.open(
      DownloadCsvDialogComponent,
      {
        header: 'Download CSV Template',
        width: '70%',
        contentStyle: { 'max-height': '50vw', overflow: 'auto' },
        data: { company: this.company, downloadLink: this.csvDownloadUrl },
      }
    );

    this.downloadCsvDialogRef.onClose.subscribe((response) => {
      this.downloadCsvDialogRef = null;
    });
  }

  openUploadCSVDialog(event) {
    const currentDate = new Date().toString();

    const fileRef = this.afStorage.ref(`Employee_CSV/${currentDate}.csv`);

    const uploadTask = fileRef.put(event.target.files[0]);
    uploadTask
      .percentageChanges()
      .subscribe((data) => (this.uploadProgress = data));

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            const updateCompany = {
              ...this.company,
              employeeCsv: url,
            };
            this.companyDetailsService.updateCompany(updateCompany).subscribe(
              (response) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Company employees have been updated.',
                });
                this.company = updateCompany;
              },
              (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'Unable to update company employees. Please try again.',
                });
              }
            );
          });
        })
      )
      .subscribe();
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

  openMassInviteInfoDialog(): void {
    this.massInviteDialogRef = this.dialogService.open(
      MassInviteInfoDialogComponent,
      {
        header: 'Mass Inviting Employees',
        width: '60%',
        contentStyle: { 'max-height': '80vw', overflow: 'auto' },
      }
    );
  }

  openArtTestDialog(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
    isVaccinated: boolean;
  }) {
    this.artTestDialogRef = this.dialogService.open(ViewArtComponent, {
      header: selectedUser.fullName + "'s ART Tests",
      width: '70%',
      contentStyle: { 'max-height': '50vw', overflow: 'auto' },
      data: selectedUser,
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
      ViewShnDeclarationDialog,
      {
        header: selectedUser.fullName + "'s SHN/QO Declaration",
        width: '70%',
        contentStyle: { 'max-height': '50vw', overflow: 'auto' },
        data: selectedUser,
      }
    );
  }
  openVaccinationDialog(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
  }) {
    this.vaccinationDialogRef = this.dialogService.open(
      ViewVaccinationDialogComponent,
      {
        header: selectedUser.fullName + "'s Vaccination Certificate",
        width: '70%',
        contentStyle: { 'max-height': '50vw', overflow: 'auto' },
        data: selectedUser,
      }
    );
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
