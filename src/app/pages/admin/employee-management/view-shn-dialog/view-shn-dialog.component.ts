import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covid-document-submission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-shn-dialog',
  templateUrl: './view-shn-dialog.component.html',
  styleUrls: ['./view-shn-dialog.component.css'],
  providers: [MessageService],
})
export class ViewShnDeclarationDialog implements OnInit {
  covidSubmissionType: string;
  remarks: string;
  startDate: string;
  endDate: string;
  showWarningMessage: boolean;
  uploadProgress: number;
  user: any;
  covidDocumentSubmissions: any[];
  mcs: any[];
  isVaccinated: boolean;
  isSubmitted: boolean;
  invalid: boolean;
  documentApprovalStatus: string;
  currentUser: any;

  constructor(
    public dialogRef: MatDialogRef<ViewShnDeclarationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private messageService: MessageService,
    private afStorage: AngularFireStorage,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
    this.covidSubmissionType = 'SHN_MEDICAL_CERTIFICATE';
    this.remarks = '';
    this.startDate = new Date().toISOString().slice(0, 10);
    this.endDate = new Date().toISOString().slice(0, 10);
    this.covidDocumentSubmissions = [];
    this.mcs = [];
    this.isVaccinated = this.data.isVaccinated;
    this.isSubmitted = false;
    this.invalid = false;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.userService.getUser(this.data.userId).subscribe(
      (response) => {
        this.user = response.user;
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot find User',
        });
      }
    );

    this.covidDocumentSubmissionService
      .getUserSubmissions(this.data.userId)
      .subscribe(
        (response) => {
          this.covidDocumentSubmissions = response.covidDocumentSubmissions;

          this.mcs = this.covidDocumentSubmissions
            .filter(
              (item) =>
                item.covidDocumentType === 'SHN_MEDICAL_CERTIFICATE' ||
                item.covidDocumentType === 'QUARANTINE_ORDER'
            )
            .sort((a, b) => {
              const dateA = moment(a.dateOfSubmission);
              const dateB = moment(b.dateOfSubmission);
              return dateB.diff(dateA);
            });

          if (this.mcs[0]) {
            this.documentApprovalStatus = this.mcs[0].documentApprovalStatus;
          }
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Cannot retrieve User SHN/QO Declaration',
          });
        }
      );
  }

  onClickSHN() {
    this.covidSubmissionType = 'SHN_MEDICAL_CERTIFICATE';
  }
  onClickQO() {
    this.covidSubmissionType = 'QUARANTINE_ORDER';
  }
  onWriteRemarks(event) {
    this.remarks = event.target.value;
  }
  onWriteStartDate(event) {
    this.startDate = event.target.value;
  }
  onWriteEndDate(event) {
    this.endDate = event.target.value;
  }
  onClickDownload() {
    window.open(this.user.latestMedicalCert, '_blank');
  }
  onConfirmClick() {
    this.userService
      .deleteUser(this.data.selectedUser.userId)
      .subscribe((response) => {
        this.data.confirmDelete = true;
        this.dialogRef.close();
      });
  }

  onCloseClick() {
    if (this.uploadProgress === -1 || this.uploadProgress === 100) {
      this.dialogRef.close();
    } else {
      this.showWarningMessage = true;
    }
  }

  renderLastUpdate() {
    if (this.mcs[0]) {
      const date = new Date(this.mcs[0].dateOfSubmission);
      return date;
    }
    return null;
  }
  renderMcStatus() {
    const today = new Date();
    //console.log(today);
    const endDate = new Date(this.mcs[0]?.endDate);
    endDate.setHours(23, 59, 59);
    if (
      this.mcs[0]?.documentApprovalStatus !== 'REJECTED' &&
      today >= new Date(this.mcs[0]?.startDate) &&
      today <= endDate
    ) {
      if (this.mcs[0]?.covidDocumentType === 'SHN_MEDICAL_CERTIFICATE') {
        return 'On stay home notice';
      } else {
        return 'On quarantine order';
      }
    }
    return 'Fit for work';
  }
  mcApprovalStatus() {
    const today = new Date();
    const endDate = new Date(this.mcs[0]?.endDate);
    endDate.setHours(23, 59, 59);
    if (
      this.mcs[0]?.documentApprovalStatus !== 'REJECTED' &&
      today >= new Date(this.mcs[0]?.startDate) &&
      today <= endDate
    ) {
      if (this.mcs[0]?.documentApprovalStatus.toUpperCase() === 'APPROVED') {
        return 'red';
      } else if (
        this.mcs[0]?.documentApprovalStatus.toUpperCase() === 'PENDING'
      ) {
        return 'grey';
      }
    }
    return 'green';
  }

  onSaveClick(form: NgForm) {
    this.isSubmitted = true;

    if (form.value.response === '') {
      this.invalid = true;
    } else {
      if (form.value.response === 'accept') {
        this.mcs[0].documentApprovalStatus = 'APPROVED';
      } else {
        this.mcs[0].documentApprovalStatus = 'REJECTED';
      }

      this.mcs[0].dateOfApproval = new Date();

      this.covidDocumentSubmissionService.updateDocument(this.mcs[0]).subscribe(
        (response) => {
          console.log(response);

          this.documentApprovalStatus =
            response.covidDocumentSubmission.documentApprovalStatus;

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Approval status updated',
            });
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Cannot update approval status',
          });
        }
      );
    }
  }
}
