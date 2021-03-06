import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { DepartmentService } from 'src/app/services/department/department.service';
import { UserService } from 'src/app/services/user/user.service';
import { CompanyDetailsService } from '../../../services/company/company-details.service';
import { DeleteEmployeeDialogComponent } from './delete-employee-dialog/delete-employee-dialog.component';
import { DepartmentInChargeOfComponent } from './department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from './department-part-of/department-part-of.component';
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
  templateUrl: './admin-employee-management.component.html',
  styleUrls: ['./admin-employee-management.component.css'],
  providers: [MatDialog, MessageService],
})
export class AdminEmployeeManagementComponent implements OnInit {
  user;
  company: any | undefined;
  departments: any | undefined;
  companyLimit: number | undefined;

  currNewUserEmail: String;
  currNewUserPosition: String;
  currNewUserFullName: String;
  currNewUserContactNumber: String;
  currNewUserIsAdmin: boolean;

  isLoading: boolean = false;
  sortField: string;

  partOfDepartments: any[];
  inChargeOfDepartments: any[];

  allDepartments: any;
  allUsers: any;

  csvDownloadUrl: string;

  uploadProgress: number;
  showWarningMessage: boolean;
  reader: FileReader;
  inputCsvData: any[];

  selectedEmployee: any;

  constructor(
    private _location: Location,
    private userService: UserService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
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
    this.reader = new FileReader();
    this.inputCsvData = [];
    this.companyLimit = 0;
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;
          this.departmentService
            .getAllDepartments(this.company.companyId)
            .subscribe(
              (response) => {
                this.departments = response.departments;
              },
              (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Departments not found',
                });
              }
            );
          if (result.company.subscriptionType == 'TIER1') {
            this.companyLimit = 30;
          } else if (result.company.subscriptionType == 'TIER2') {
            this.companyLimit = 80;
          } else if (result.company.subscriptionType == 'TIER3') {
            this.companyLimit = -1;
          }
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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Users not found',
        });
      }
    );
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
        height: 'auto',
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
      height: 'auto',
      data: { partOfDepartments: this.partOfDepartments },
    });

    deptPartOfDialogRef.afterClosed().subscribe(
      (result) => {
        this.partOfDepartments = result;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Part of Departments not saved',
        });
      }
    );
  }

  downloadCSVTemplate() {
    let downloadCsvDialogRef = this.dialog.open(DownloadCsvDialogComponent, {
      width: '40%',
      height: 'auto',
      data: { company: this.company, downloadLink: this.csvDownloadUrl },
    });
  }

  openUploadCSVDialog(event) {
    const currentDate = new Date().toString();

    const fileRef = this.afStorage.ref(`Employee_CSV/${currentDate}.csv`);

    const uploadTask = fileRef.put(event.target.files[0]);

    this.reader.readAsText(event.target.files[0]);
    this.reader.onload = () => {
      let csvData = this.reader.result;
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

      let headersRow = this.getHeaderArray(csvRecordsArray);

      this.inputCsvData = this.getDataRecordsArrayFromCSVFile(
        csvRecordsArray,
        headersRow.length
      );

      let errorUsers = [];
      for (let user of this.inputCsvData) {
        this.userService.createNewUser(user).subscribe(
          (response) => {
            const userIndex = this.inputCsvData.findIndex(
              (index) => index === user
            );
            if (userIndex === this.inputCsvData.length - 1) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Employees have been invited',
              });
            }
            if (errorUsers.length > 0) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'Unable to invite employees' +
                  errorUsers.forEach((user) => {
                    return user.fullName;
                  }) +
                  '. Please try again.',
              });
            }
          },
          (error) => {
            errorUsers.push(user);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to create new user',
            });
          }
        );
      }
    };
    this.reader.onerror = function () {
      console.log('Error is occured while reading file!');
    };

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
                this.userService.getUsers(this.user.companyId).subscribe(
                  (response) => {
                    this.allUsers = response.users;
                  },
                  (error) => {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Users in company not found',
                    });
                  }
                );
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

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[1]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    let deptsInChargeOfIds = [];
    let deptsPartOfIds = [];

    for (let i = 2; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length === headerLength) {
        let deptInChargeOfData = (<string>currentRecord[4]).split('+');
        let deptPartOfData = (<string>currentRecord[5]).split('+');

        for (let dept of deptInChargeOfData) {
          if (dept !== '') {
            let existingDepartment = this.departments.find(
              (department) => department.name === dept
            );
            if (
              existingDepartment !== null &&
              existingDepartment !== undefined
            ) {
              deptsInChargeOfIds.push(existingDepartment.departmentId);
            } else {
              let newDept = {
                name: dept,
                company: { companyId: this.company.companyId },
              };
              this.departmentService.createNewDepartment(newDept).subscribe(
                (response) => {
                  console.log('IN CHARGE OF DEPT CREATED', response.department);
                  deptsInChargeOfIds.push(response.department.departmentId);
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail:
                      'Department In Charge Of:' + dept + 'has been created.',
                  });
                },
                (error) => {
                  console.log('Department In Charge of could not be created');
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'Department In Charge Of:' +
                      dept +
                      'could not be created.',
                  });
                }
              );
            }
          }
        }

        for (let dept of deptPartOfData) {
          if (dept !== '') {
            let existingDepartment = this.departments.find(
              (department) => department.name === dept
            );
            if (
              existingDepartment !== null &&
              existingDepartment !== undefined
            ) {
              deptsPartOfIds.push(existingDepartment.departmentId);
            } else {
              let newDept = {
                name: dept,
                company: { companyId: this.company.companyId },
              };
              this.departmentService.createNewDepartment(newDept).subscribe(
                (response) => {
                  console.log('PART OF DEPT CREATED', response.department);
                  deptsPartOfIds.push(response.department.departmentId);
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Department Part Of:' + dept + 'has been created.',
                  });
                },
                (error) => {
                  console.log('Department Part of could not be created');
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'Department Part Of:' + dept + 'could not be created.',
                  });
                }
              );
            }
          }
        }

        if (currentRecord[6].trim() === 'Yes') {
          this.currNewUserIsAdmin = true;
        } else if (currentRecord[6].trim() === 'No') {
          this.currNewUserIsAdmin = false;
        }

        let csvRecord = {
          email: currentRecord[0].trim(),
          fullName: currentRecord[1].trim(),
          company: { companyId: this.company.companyId },
          password: 'password',
          contactNumber: currentRecord[2].trim(),
          deptsInChargeOf: { deptsInChargeOf: deptsInChargeOfIds },
          deptsPartOf: { deptsPartOf: deptsPartOfIds },
          accessRight: this.currNewUserIsAdmin ? 'ADMIN' : 'GENERAL',
        };

        console.log('Output CSV Record', csvRecord);
        csvArr.push(csvRecord);
        deptsInChargeOfIds = [];
        deptsPartOfIds = [];
      }
    }
    return csvArr;
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
      accessRight: this.currNewUserIsAdmin ? 'ADMIN' : 'GENERAL',
    };

    let newUserId = null;
    this.userService.createNewUser(user).subscribe(
      (response) => {
        newUserId = response.user.userId;
        if (!newUserId) {
        } else {
          this.ngOnInit();
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee has been added.',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error when adding Employee.',
        });
      }
    );
  }

  openMassInviteInfoDialog(): void {
    let massInviteDialogRef = this.dialog.open(MassInviteInfoDialogComponent, {
      width: '40%',
      height: 'auto',
    });
  }

  openArtTestDialog(selectedUser: any) {
    let artTestDialogRef = this.dialog.open(ViewArtComponent, {
      data: {
        userId: selectedUser.userId,
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        createdAt: selectedUser.createdAt,
        contactNumber: selectedUser.contactNumber,
        isActivated: selectedUser.isActivated,
      },
      width: '40%',
      height: 'auto',
    });
  }
  openShnDeclarationDialog(selectedUser: any) {
    let shnDeclarationDialogRef = this.dialog.open(ViewShnDeclarationDialog, {
      data: {
        userId: selectedUser.userId,
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        createdAt: selectedUser.createdAt,
        contactNumber: selectedUser.contactNumber,
        isActivated: selectedUser.isActivated,
      },
      width: '40%',
      height: 'auto',
    });
  }
  openVaccinationDialog(selectedUser: any) {
    let vaccinationDialogRef = this.dialog.open(
      ViewVaccinationDialogComponent,
      {
        data: {
          userId: selectedUser.userId,
          fullName: selectedUser.fullName,
          email: selectedUser.email,
          createdAt: selectedUser.createdAt,
          contactNumber: selectedUser.contactNumber,
          isActivated: selectedUser.isActivated,
        },
        width: '40%',
        height: 'auto',
      }
    );
  }

  openEditEmployeeDialog(selectedUser: any) {
    let editDialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      data: {
        userId: selectedUser.userId,
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        createdAt: selectedUser.createdAt,
        contactNumber: selectedUser.contactNumber,
        isActivated: selectedUser.isActivated,
        accessRight: selectedUser.accessRight,
        position: selectedUser.position,
        companyId: selectedUser.companyId,
      },
      width: '70%',
      height: 'auto',
    });

    editDialogRef.afterClosed().subscribe(
      (response) => {
        if (response.action === 'SUCCESS') {
          this.userService.getUsers(this.user.companyId).subscribe(
            (response) => {
              this.allUsers = response.users;
            },
            (error) => {
              console.log(error);
            }
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${selectedUser.userId} has been updated`,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `User could not be updated.`,
        });
      }
    );
  }

  onDeleteEmployeeClick(selectedUser: any) {
    let deleteDialogRef = this.dialog.open(DeleteEmployeeDialogComponent, {
      data: { userId: selectedUser.userId, confirmDelete: false },
      width: '30%',
      height: 'auto',
    });

    deleteDialogRef.afterClosed().subscribe(
      (response) => {
        if (response.action === 'SUCCESS') {
          this.userService.getUsers(this.user.companyId).subscribe(
            (response) => {
              this.allUsers = response.users;
            },
            (error) => {
              console.log(error);
            }
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${selectedUser.userId} has been deleted`,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `User could not be deleted.`,
        });
      }
    );
  }
}
