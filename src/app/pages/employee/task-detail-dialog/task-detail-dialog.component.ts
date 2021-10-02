import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
  styleUrls: ['./task-detail-dialog.component.css'],
})
export class TaskDetailDialogComponent implements OnInit {
  task: any;
  goal: any;

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {
    this.task = this.dialogConfig.data.task;
    this.goal = this.dialogConfig.data.goal;
    console.log(this.goal);
  }

  ngOnInit(): void {}

  closeDialog() {
    this.ref.close();
  }
}
