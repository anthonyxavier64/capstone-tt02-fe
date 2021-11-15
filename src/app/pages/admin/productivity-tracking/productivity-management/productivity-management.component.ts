import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { CompanyDetailsService } from "../../../../services/company/company-details.service";
import { DepartmentService } from 'src/app/services/department/department.service';

import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViewProductivityDialogComponent } from '../view-productivity-stats/view-productivity-dialog/view-productivity-dialog.component';

export interface user {
  userId: number;
  fullName: string;
  email: string;
  createdAt: string;
  contactNumber: string;
  isActivated: boolean;
}
@Component({
  selector: 'app-productivity-management',
  templateUrl: './productivity-management.component.html',
  styleUrls: ['./productivity-management.component.css'],
  providers: [MatDialog, MessageService],
})
export class ProductivityManagementComponent implements OnInit {

  user;
  company: any | undefined;
  departments: any | undefined;

  selectedDepartment: any | undefined;
  searchQuery: any | undefined;

  isLoading: boolean = false;

  allDepartments: any;
  allUsers: any;

  chosenUser: any;
  searchResults: any;
  departmentUsers: any;

  viewDialogRef: DynamicDialogRef;

  constructor(private userService: UserService,
    private companyDetailsService: CompanyDetailsService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private dialogService: DialogService) { }

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
                console.log(error);
              }
            );
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

    this.userService.getUsers(this.user.companyId).subscribe(
      (response) => {
        this.allUsers = response.users;
        this.searchResults = this.allUsers;
        this.isLoading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not retrieve users',
        });
      }
    );
  }

  handleSearch() {
    if (
      this.searchQuery === '' ||
      this.searchQuery === undefined ||
      this.searchQuery === null
    ) {
      this.allUsers = [];
      this.searchResults = [];
      this.handleUserSelection();
    } else {
      this.searchResults = this.searchResults.filter((user) =>
        user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  handleUserSelection() {
    this.isLoading = true;
    this.userService.getUsers(this.user.companyId).subscribe(
      (response) => {
        this.allUsers = response.users;
        this.searchResults = this.allUsers;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not retrieve users',
        });
      }
    );
  }

  handleDepartmentSelection() {
    if (!!this.selectedDepartment) {
      this.isLoading = true;
      let employees = [];

      for (let u of this.allUsers) {
        console.log(`User Email: ${u.email}`);
        this.userService.getDepartments(u.email).subscribe(
          (response) => {
            var responseDept = response.userDept;
            console.log(`Response Department: ${responseDept}`);
            for (let r of responseDept) {
              if (r.name === this.selectedDepartment.name && !employees.includes(u)) {
                employees.push(u);
              }
            }
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Could not retrieve departments',
            });
          }
        );
        this.userService.getManagedDepartments(u.email).subscribe(
          (response) => {
            var responseMDept = response.userDept;
            console.log(`Response Managed Department: ${responseMDept}`);
            for (let r of responseMDept) {
              if (r.name === this.selectedDepartment.name && !employees.includes(u)) {
                employees.push(u);
              }
            }
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Could not retrieve managed departments',
            });
          }
        );
      }
      this.searchResults = employees;
    }
    else {
      this.searchResults = this.allUsers;
    }
  }

  openViewEmployeeDialog(chosenUser: {
    userId: number;
    fullName: string;
    email: string;
    contactNumber: number;
    numLeavesTaken: number;
    datesInOffice: any;
  }) {
    this.viewDialogRef = this.dialogService.open(ViewProductivityDialogComponent, {
      header: chosenUser.fullName + ' (' + chosenUser.userId + ')',
      width: '70%',
      contentStyle: { 'max-height': '50vw', overflow: 'auto' },
      data: chosenUser,
    });
  }

}
