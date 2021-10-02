import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
  styleUrls: ['./task-detail-dialog.component.css'],
})
export class TaskDetailDialogComponent implements OnInit {
  task: any;
  goal: any;
  assignPopup: boolean;
  filterValue: string;
  employees: any[];
  selectedEmployees: any[];

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private taskService: TaskService
  ) {
    this.task = this.dialogConfig.data.task;
    this.goal = this.dialogConfig.data.goal;
    this.employees = this.dialogConfig.data.employees;
    this.assignPopup = false;
    this.filterValue = '';
  }

  ngOnInit(): void {}

  closeDialog() {
    this.ref.close();
  }

  toggleAssignMore() {
    this.assignPopup = !this.assignPopup;

    if (this.assignPopup === false) {
      // add employee
      this.taskService
        .addUsersToTask(this.selectedEmployees, this.task.taskId)
        .subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {}
        );
    }
  }

  handleSearch() {}
}
