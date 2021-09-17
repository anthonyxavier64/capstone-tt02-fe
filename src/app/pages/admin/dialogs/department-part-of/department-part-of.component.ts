import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { Department } from 'src/app/models/department.model';
import { NewDepartmentComponent } from '../new-department/new-department.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-department-part-of',
  templateUrl: './department-part-of.component.html',
  styleUrls: ['./department-part-of.component.css'],
})
export class DepartmentPartOfComponent implements OnInit {
  allDepartments: any[];
  allDepartmentsNames: String[];
  selectedDepartments: any[];
  test = false;

  constructor(
    private UserService: UserService,
    private dialogRef: MatDialogRef<DepartmentPartOfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Below is the correct code
    // this.UserService.getDepartments().subscribe(
    //   (response) => {
    //     this.allDepartments = response;
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    var deptLocalStorage = localStorage.getItem('allDepts');
    if (deptLocalStorage != null) {
      this.allDepartments = JSON.parse(deptLocalStorage);
      for (let dept of this.allDepartments) {
        dept.isSelected = false;
      }
    }
  }

  // Handles the logic of the drag and drop table of Depts
  drop(event: CdkDragDrop<Department[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  // Returns the department the user is part of to the parent component
  confirmDepartmentPartOf() {
    for (let dept of this.allDepartments) {
      if (dept.isSelected == true) {
        this.selectedDepartments.push(dept);
      }
    }
    this.dialogRef.close({ departmentsPartOf: this.selectedDepartments });
  }

  openNewDepartmentDialog() {
    let newDepartmentDialogRef = this.dialog.open(NewDepartmentComponent, {
      width: '50%',
      height: '50%',
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
