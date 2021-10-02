import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
  styleUrls: ['./task-detail-dialog.component.css'],
})
export class TaskDetailDialogComponent implements OnInit {
  task: any;

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {
    this.task = this.dialogConfig.data.task;
  }

  ngOnInit(): void {}

  closeDialog() {
    this.ref.close();
  }
}
