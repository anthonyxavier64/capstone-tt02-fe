import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Department } from 'src/app/models/department.model';
import { NewDepartmentComponent } from '../new-department/new-department.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-department-part-of',
  templateUrl: './department-part-of.component.html',
  styleUrls: ['./department-part-of.component.css'],
})
export class DepartmentPartOfComponent implements OnInit {
  allDepartments: Department[];
  allDepartmentsNames: String[];
  selectedDepartments: Department[];

  constructor(
    private UserService: UserService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.UserService.getDepartments().subscribe(
      (response) => {
        this.allDepartments = response;
      },
      (error) => {
        console.log(error);
      }
    );
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
    this.ref.close({ departmentsPartOf: this.selectedDepartments });
  }

  openNewDepartmentDialog() {
    const openNewDepartmentRef = this.dialogService.open(
      NewDepartmentComponent,
      {
        width: '50%',
        height: '50%',
      }
    );

    openNewDepartmentRef.onClose.subscribe(() => {
      this.UserService.getDepartments().subscribe(
        (response) => {
          this.allDepartments = response;
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }
}
