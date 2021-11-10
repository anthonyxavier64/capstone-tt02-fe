import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UnavailableDateService } from 'src/app/services/unavailableDate/unavailable-date.service';
import { EditUnavailableDateDialogComponent } from '../edit-unavailable-date-dialog/edit-unavailable-date-dialog.component';

@Component({
  selector: 'app-manage-unavailable-date',
  templateUrl: './manage-unavailable-date.component.html',
  styleUrls: ['./manage-unavailable-date.component.css'],
  providers: [MessageService],
})
export class ManageUnavailableDateComponent implements OnInit {
  user: any;
  leaveDates: any[] = [];
  leave: any;

  constructor(
    private _location: Location,
    private unavailableDateService: UnavailableDateService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('currentUser');
    const { userId } = JSON.parse(this.user);

    if (this.user) {
      this.unavailableDateService.getUnavailableDateByUid(userId).subscribe(
        (result) => {
          this.leaveDates = result.unavailableDate;
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Leaves not found',
          });
        }
      );
    }
  }

  submit(addLeaveDayForm: NgForm) {
    const leave = addLeaveDayForm.value;
    const { userId } = JSON.parse(this.user);

    const newleave = {
      date: leave.date,
      title: leave.title,
      description: leave.description,
      employeeId: userId,
    };

    this.unavailableDateService.createUnavailableDate(newleave).subscribe(
      (response) => {
        this.leaveDates.push(response.unavailableDate);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Blockout date has been added.',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error adding blockout date. Please try again.',
        });
      }
    );

    addLeaveDayForm.resetForm();
  }

  editLeaveDate(leave: any) {
    let dialogRef = this.dialog.open(EditUnavailableDateDialogComponent, {
      width: '40vw',
      height: 'auto',
      data: leave,
    });

    dialogRef.afterClosed().subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave date updated successfully.',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to update. Please try again.',
        });
      }
    );
  }

  deleteLeaveDate(leave: any) {
    this.unavailableDateService.deleteUnavailableDate(leave).subscribe(
      (result) => {
        const indexToRemove = this.leaveDates.indexOf(leave);
        this.leaveDates.splice(indexToRemove, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave date has been deleted.',
        });
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Problem deleting leave date. Please try again.',
        });
      }
    );
  }

  onBackClick() {
    this._location.back();
  }
}
