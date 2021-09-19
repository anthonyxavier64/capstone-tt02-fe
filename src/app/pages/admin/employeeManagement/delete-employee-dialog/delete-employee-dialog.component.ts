import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-employee-dialog',
  templateUrl: './delete-employee-dialog.component.html',
  styleUrls: ['./delete-employee-dialog.component.css'],
})
export class DeleteEmployeeDialogComponent implements OnInit {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {}

  onConfirmClick() {
    //ADD DELETE BE LOGIC HERE
    this.config.data.confirmDelete = true;
    this.ref.close(this.config);
  }

  onCloseClick() {
    this.ref.close();
  }
}
