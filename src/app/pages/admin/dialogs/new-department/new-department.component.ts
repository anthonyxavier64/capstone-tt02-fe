import { Component, OnInit } from '@angular/core';

import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/department/department.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.css'],
})
export class NewDepartmentComponent implements OnInit {
  departmentName: string;

  constructor(
    private departmentService: DepartmentService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {}

  onClickConfirm() {
    this.departmentService.createNewDepartment(
      new Department(undefined, this.departmentName)
    );
    this.ref.close();
  }
}
