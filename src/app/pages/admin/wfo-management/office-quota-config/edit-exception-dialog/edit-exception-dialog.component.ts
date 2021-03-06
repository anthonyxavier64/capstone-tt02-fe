import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { exceptionData } from '../office-quota-config.component';

@Component({
  selector: 'app-edit-exception-dialog',
  templateUrl: './edit-exception-dialog.component.html',
  styleUrls: ['./edit-exception-dialog.component.css'],
})
export class EditExceptionDialogComponent implements OnInit {
  dialogDisplayData: any;
  wfoMonthlyAllocation: number;

  constructor(
    public dialogRef: MatDialogRef<EditExceptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: exceptionData
  ) {
    this.dialogDisplayData = data;
    this.wfoMonthlyAllocation = data.wfoMonthlyAllocation;
  }

  onSave(editUserWfoMonthlyAllocationForm: NgForm): void {
    if (editUserWfoMonthlyAllocationForm.value.updateWfoAllocation !== '') {
      const updatedNumber =
        editUserWfoMonthlyAllocationForm.value.updateWfoAllocation;
      this.data.wfoMonthlyAllocation = updatedNumber;
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {}
}
