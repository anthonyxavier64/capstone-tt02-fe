import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { NewDepartmentComponent } from '../new-department/new-department.component';
import { DepartmentService } from 'src/app/services/department/department.service';

@Component({
  selector: 'app-department-part-of',
  templateUrl: './department-part-of.component.html',
  styleUrls: ['./department-part-of.component.css'],
})
export class DepartmentPartOfComponent implements OnInit {
  allDepartments: any[];
  selectedDepartments: any[];

  constructor(
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DepartmentPartOfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.allDepartments = [];
    this.selectedDepartments = [];
  }

  ngOnInit(): void {
    // Below is the correct code
    this.departmentService.getAllDepartments().subscribe(
      (response) => {
        this.allDepartments = response.types.departments;
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

  // Returns the department the user is part of to the parent component
  confirmDepartmentPartOf() {
    console.log('pre-confirm: ' + JSON.stringify(this.data));
    for (let dept of this.allDepartments) {
      if (dept.isSelected == true) {
        delete dept.isSelected;
        this.data.partOfDepartments.push(dept);
      }
    }
    this.dialogRef.close(this.data.partOfDepartments);
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
      this.departmentService.getAllDepartments().subscribe(
        (response) => {
          this.allDepartments = response;
        },
        (error) => {
          console.log(error);
        }
      );
    });

    // openNewDepartmentRef.onClose.subscribe(() => {
    //   this.UserService.getDepartments().subscribe(
    //     (response) => {
    //       this.allDepartments = response;
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // });
  }
}
