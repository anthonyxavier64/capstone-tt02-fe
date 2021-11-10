import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { UnavailableDateService } from 'src/app/services/unavailableDate/unavailable-date.service';

@Component({
  selector: 'app-edit-unavailable-date-dialog',
  templateUrl: './edit-unavailable-date-dialog.component.html',
  styleUrls: ['./edit-unavailable-date-dialog.component.css'],
  providers: [MessageService],
})
export class EditUnavailableDateDialogComponent implements OnInit {
  leave: any;

  constructor(
    public dialogRef: MatDialogRef<EditUnavailableDateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private unavailableDateService: UnavailableDateService,
    private messageService: MessageService
  ) {
    this.leave = data;
  }

  ngOnInit(): void {}

  onSave(editLeaveDayForm: NgForm) {
    var leave = editLeaveDayForm.value;

    const oldLeave = this.leave;

    const storedOldBod = {
      name: oldLeave.name,
      location: oldLeave.location,
      capacity: oldLeave.capacity,
    };

    oldLeave.date = leave.date;
    oldLeave.title = leave.title;
    oldLeave.description = leave.description;

    this.unavailableDateService.updateUnavailableDate(oldLeave).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave date is updated.',
        });
      },
      (error) => {
        oldLeave.name = storedOldBod.name;
        oldLeave.location = storedOldBod.location;
        oldLeave.capacity = storedOldBod.capacity;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to update. Please try again.',
        });
      }
    );
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
