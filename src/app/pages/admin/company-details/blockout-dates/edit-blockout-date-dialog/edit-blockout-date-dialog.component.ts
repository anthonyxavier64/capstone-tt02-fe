import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { BlockoutDateService } from 'src/app/services/blockoutDate/blockout-date.service';

@Component({
  selector: 'app-edit-blockout-date-dialog',
  templateUrl: './edit-blockout-date-dialog.component.html',
  styleUrls: ['./edit-blockout-date-dialog.component.css'],
  providers: [MessageService],
})
export class EditBlockoutDateDialogComponent implements OnInit {
  blockoutDate: any;

  constructor(
    public dialogRef: MatDialogRef<EditBlockoutDateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private blockoutDateService: BlockoutDateService,
    private messageService: MessageService
  ) {
    this.blockoutDate = data;
  }

  ngOnInit(): void {}

  onSave(editBlockoutDayForm: NgForm) {
    var bod = editBlockoutDayForm.value;

    const oldBod = this.blockoutDate;

    const storedOldBod = {
      name: oldBod.name,
      location: oldBod.location,
      capacity: oldBod.capacity,
    };

    oldBod.date = bod.date;
    oldBod.title = bod.title;
    oldBod.description = bod.description;

    this.blockoutDateService.updateBlockoutDate(oldBod).subscribe(
      (response) => {
        this.dialogRef.close({ action: 'SUCCESS' });
      },
      (error) => {
        oldBod.name = storedOldBod.name;
        oldBod.location = storedOldBod.location;
        oldBod.capacity = storedOldBod.capacity;

        this.dialogRef.close({ action: 'ERROR' });
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close({ action: 'CLOSED' });
  }
}
