import { MessageService } from 'primeng/api';
import { BlockoutDateService } from 'src/app/services/blockoutDate/blockout-date.service';
import { CompanyService } from 'src/app/services/company/company.service';

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { EditBlockoutDateDialogComponent } from '../edit-blockout-date-dialog/edit-blockout-date-dialog.component';

@Component({
  selector: 'app-manage-blockout-date',
  templateUrl: './manage-blockout-date.component.html',
  styleUrls: ['./manage-blockout-date.component.css'],
  providers: [MessageService],
})
export class ManageBlockoutDateComponent implements OnInit {
  company: any;
  blockoutDates: any[] = [];
  bod: any;

  constructor(
    private _location: Location,
    private companyService: CompanyService,
    private blockoutDateService: BlockoutDateService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    const { companyId } = JSON.parse(currentUser);

    this.companyService.getCompany(companyId).subscribe(
      (result) => {
        this.company = result.company;
        this.blockoutDates = this.company.blockoutDates;
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Company not found',
        });
      }
    );
  }

  submit(addBlockoutDayForm: NgForm) {
    const bod = addBlockoutDayForm.value;

    const newBod = {
      date: bod.date,
      title: bod.title,
      description: bod.description,
      companyId: this.company.companyId,
    };

    this.blockoutDateService.createBlockoutDate(newBod).subscribe(
      (response) => {
        this.blockoutDates.push(response.blockoutDate);

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

    addBlockoutDayForm.resetForm();
  }

  editBlockoutDate(bod: any) {
    let dialogRef = this.dialog.open(EditBlockoutDateDialogComponent, {
      width: '40vw',
      height: 'auto',
      data: bod,
    });

    dialogRef.afterClosed().subscribe(
      (response) => {
        if (response.action === 'SUCCESS') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Blockout date updated successfully.',
            });
        } else if (response.action === 'ERROR') {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to update. Please try again.',
          });
        }
      }
    );
  }

  deleteBlockoutDate(bod: any) {
    this.blockoutDateService.deleteBlockoutDate(bod).subscribe(
      (result) => {
        const indexToRemove = this.blockoutDates.indexOf(bod);
        this.blockoutDates.splice(indexToRemove, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Blockout date has been deleted.',
        });
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Problem deleting blockout date. Please try again.',
        });
      }
    );
  }

  onBackClick() {
    this._location.back();
  }
}
