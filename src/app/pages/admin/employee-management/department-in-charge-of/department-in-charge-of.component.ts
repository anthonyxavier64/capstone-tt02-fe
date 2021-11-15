import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DepartmentService } from 'src/app/services/department/department.service';
import { NewDepartmentComponent } from '../new-department/new-department.component';

@Component({
  selector: 'app-department-in-charge-of',
  templateUrl: './department-in-charge-of.component.html',
  styleUrls: ['./department-in-charge-of.component.css'],
})
export class DepartmentInChargeOfComponent implements OnInit {
  allDepartments: any[];
  user: any;

  constructor(
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DepartmentInChargeOfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }

    // Below is the correct code
    this.departmentService.getAllDepartments(this.user.companyId).subscribe(
      (response) => {
        this.allDepartments = response.departments;
        for (let department of this.data.inChargeOfDepartments) {
          const indexToSelect = this.allDepartments.findIndex(
            (item) => item.departmentId === department.departmentId
          );
          this.allDepartments[indexToSelect].isSelected = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
