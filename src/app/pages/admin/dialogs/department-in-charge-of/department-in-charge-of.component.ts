import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { NewDepartmentComponent } from '../new-department/new-department.component';
import { UserService } from 'src/app/services/user/user.service';

import { DepartmentService } from 'src/app/services/department/department.service';
@Component({
  selector: 'app-department-in-charge-of',
  templateUrl: './department-in-charge-of.component.html',
  styleUrls: ['./department-in-charge-of.component.css'],
})
export class DepartmentInChargeOfComponent implements OnInit {
  allDepartments: any[];
  selectedDepartments: any[];
  user: any;

  constructor(
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DepartmentInChargeOfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.allDepartments = [];
    this.selectedDepartments = [];
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }

    // Below is the correct code
    this.departmentService.getAllDepartments(this.user.companyId).subscribe(
      (response) => {
        this.allDepartments = response.departments;
      },
      (error) => {
        console.log(error);
      }
    );

    // var deptLocalStorage = localStorage.getItem('allDepts');
    // if (deptLocalStorage != null) {
    //   this.allDepartments = JSON.parse(deptLocalStorage);
    //   for (let dept of this.allDepartments) {
    //     dept.isSelected = false;
    //   }
    // }
  }

  confirmDepartmentInChargeOf() {
    for (let dept of this.allDepartments) {
      if (dept.isSelected == true) {
        delete dept.isSelected;
        this.data.inChargeOfDepartments.push(dept);
      }
    }
    this.dialogRef.close(this.data.inChargeOfDepartments);
  }

  openNewDepartmentDialog() {
    let newDepartmentDialogRef = this.dialog.open(NewDepartmentComponent, {
      width: '50%',
      height: '50%',
    });

    // Use this if the DB is down
    // newDepartmentDialogRef.afterClosed().subscribe(() => {
    //   var deptLocalStorage = localStorage.getItem('allDepts');
    //   if (deptLocalStorage != null) {
    //     this.allDepartments = JSON.parse(deptLocalStorage);
    //     for (let dept of this.allDepartments) {
    //       dept.isSelected = false;
    //     }
    //   }
    // });

    // Below is the correct code if the DB works
    newDepartmentDialogRef.afterClosed().subscribe(() => {
      this.departmentService.getAllDepartments(this.user.companyId).subscribe(
        (response) => {
          this.allDepartments = response.departments;
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }
}
