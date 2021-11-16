import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { MessageService } from 'primeng/api';
import { DepartmentService } from 'src/app/services/department/department.service';
import { DepartmentInChargeOfComponent } from '../department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from '../department-part-of/department-part-of.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
@Component({
  selector: 'app-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.css'],
  providers: [MessageService],
})
export class EditEmployeeDialogComponent implements OnInit {
  user: any;
  isAdmin: boolean;
  fullName: string;
  contactNumber: number;
  position: string;
  userId: any;
  companyId: any;
  email: any;

  dept: any[] = [];
  allDept: any[] = [];
  mdept: any[] = [];
  allMDept: any[] = [];
  isInCharge: boolean = true;
  isPartOf: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fullName = this.data.fullName;
    this.contactNumber = this.data.contactNumber;
    this.position = this.data.position;
    this.userId = this.data.userId;
    this.companyId = this.data.companyId;
    this.email = this.data.email;
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    if (this.data.accessRight === 'ADMIN') {
      this.isAdmin = true;
    } else if (this.data.accessRight === 'GENERAL') {
      this.isAdmin = false;
    }

    this.userService.getDepartments(this.userId).subscribe(
      (response) => {
        this.dept = response.dept;

        this.departmentService.getAllDepartments(this.user.companyId).subscribe(
          (response) => {
            this.allDept = response.departments;
            for (let department of this.dept) {
              const indexToSelect = this.allDept.findIndex(
                (item) => item.departmentId === department.departmentId
              );
              this.allDept[indexToSelect].isSelected = true;
            }
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
          detail: 'Departments not found',
        });
        console.log(error);
      }
    );

    this.userService.getManagedDepartments(this.userId).subscribe(
      (response) => {
        this.mdept = response.mdept;

        this.departmentService.getAllDepartments(this.user.companyId).subscribe(
          (response) => {
            this.allMDept = response.departments;
            for (let department of this.mdept) {
              const indexToSelect = this.allMDept.findIndex(
                (item) => item.departmentId === department.departmentId
              );
              this.allMDept[indexToSelect].isSelected = true;
            }
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
          detail: 'Managed departments not found',
        });
      }
    );
  }

  saveDetails(form: NgForm) {
    var formValue = form.value;
    if (formValue.fullName !== '') {
      this.data.fullName = formValue.fullName;
    }
    if (formValue.email !== '') {
      this.data.email = formValue.email;
    }
    if (formValue.contactNumber !== '') {
      this.data.contactNumber = formValue.contactNumber;
    }
    if (formValue.position !== '') {
      this.data.position = formValue.position;
    }
    if (formValue.isAdmin === true) {
      this.data.accessRight = 'ADMIN';
    }
    if (formValue.isAdmin === false) {
      this.data.accessRight = 'GENERAL';
    }

    if (this.isInCharge) {
      for (let d of this.allDept) {
        if (d.isSelected == true) {
          delete d.isSelected;
          this.mdept.push(d);
        }
      }
    }

    if (this.isPartOf) {
      for (let d of this.allDept) {
        if (d.isSelected == true) {
          delete d.isSelected;
          this.dept.push(d);
        }
      }
    }

    this.userService.updateUserDetails(this.data).subscribe(
      (response) => {
        this.dialogRef.close({ action: 'SUCCESS' });
      },
      (error) => {
        this.data.confirmEdit = true;
        this.data.hasBeenUpdated = false;
        this.dialogRef.close();
        console.log(error);
      }
    );
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
