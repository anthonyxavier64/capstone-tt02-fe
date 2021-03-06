import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covid-document-submission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-art-dialog',
  templateUrl: './view-art-dialog.component.html',
  styleUrls: ['./view-art-dialog.component.css'],
  providers: [MessageService],
})
export class ViewArtComponent implements OnInit {
  showWarningMessage: boolean;
  uploadProgress: number;
  user: any;
  covidDocumentSubmissions: any[];
  artTests: any[];
  isVaccinated: boolean;
  documentApprovalStatus: string;
  isSubmitted: boolean;
  invalid: boolean;
  currentUser: any;

  constructor(
    public dialogRef: MatDialogRef<ViewArtComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private messageService: MessageService,
    private afStorage: AngularFireStorage,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
    this.covidDocumentSubmissions = [];
    this.artTests = [];
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

          this.artTests = this.covidDocumentSubmissions
            .filter((item) => item.covidDocumentType === 'ART_TEST_RESULT')
            .sort((a, b) => {
              const dateA = moment(a.dateOfSubmission);
              const dateB = moment(b.dateOfSubmission);
              return dateB.diff(dateA);
            });

          if (this.artTests[0]) {
            this.documentApprovalStatus =
              this.artTests[0].documentApprovalStatus;
          }
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Cannot retrieve User ART/FET Test Results',
          });
        }
      );
  }
  onConfirmClick() {
    this.userService
      .deleteUser(this.data.selectedUser.userId)
      .subscribe((response) => {
        this.data.confirmDelete = true;
        this.dialogRef.close();
      });
  }
  onClickDownload() {
    window.open(this.user.latestArtTestResult, '_blank');
  }

  onCloseClick() {
    if (this.uploadProgress === -1 || this.uploadProgress === 100) {
      this.dialogRef.close();
    } else {
      this.showWarningMessage = true;
    }
  }

  renderLastUpdate() {
    if (this.artTests[0]) {
      const date = new Date(this.artTests[0].dateOfSubmission);
      return date;
    }
    return null;
  }
  fetApprovalStyle() {
    if (this.artTests[0]?.documentApprovalStatus.toUpperCase() === 'APPROVED') {
      if (
        this.artTests[0].isPositive &&
        this.artTests[0].documentApprovalStatus.toUpperCase() !== 'REJECTED'
      ) {
        return 'red';
      }
      return 'green';
    }
    return 'grey';
  }
  renderFetApprovalStatus() {
    if (this.artTests[0]) {
      if (this.artTests[0].isPositive) {
        return 'Positive';
      }
      return 'Negative';
    }
    return 'Unsubmitted';
  }
  onSaveClick(form: NgForm) {
    this.isSubmitted = true;

    if (form.value.response === '') {
      this.invalid = true;
    } else {
      if (form.value.response === 'accept') {
        this.artTests[0].documentApprovalStatus = 'APPROVED';
      } else {
        this.artTests[0].documentApprovalStatus = 'REJECTED';
      }

      this.artTests[0].dateOfApproval = new Date();

      this.covidDocumentSubmissionService
        .updateDocument(this.artTests[0])
        .subscribe(
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
