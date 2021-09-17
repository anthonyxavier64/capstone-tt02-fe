import { Component, OnInit } from '@angular/core';

import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/department/department.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.css'],
})
export class NewDepartmentComponent implements OnInit {
  departmentName: string;

  constructor(
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<NewDepartmentComponent>
  ) {}

  ngOnInit(): void {}

  onClickConfirm() {
    // Use this if DB is down
    // var currentDepts = JSON.parse(localStorage.getItem('allDepts'));
    // currentDepts

    // Below is if the DB works
    // this.departmentService.createNewDepartment(
    //   new Department(undefined, this.departmentName)
    // );
    this.dialogRef.close();
  }
}
