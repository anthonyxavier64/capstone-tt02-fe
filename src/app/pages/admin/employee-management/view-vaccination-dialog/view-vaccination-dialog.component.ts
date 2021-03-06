import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covid-document-submission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-vaccination-dialog',
  templateUrl: './view-vaccination-dialog.component.html',
  styleUrls: ['./view-vaccination-dialog.component.css'],
  providers: [MessageService],
})
export class ViewVaccinationDialogComponent implements OnInit {
  showWarningMessage: boolean;
  uploadProgress: number;
  user: any;
  downloadUrl: string;
  vaccinationCerts: any[];
  covidDocumentSubmissions: any[];
  isVaccinated: boolean;
  documentApprovalStatus: string;
  isSubmitted: boolean;
  invalid: boolean;
  currentUser: any;

  constructor(
    public dialogRef: MatDialogRef<ViewVaccinationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private messageService: MessageService,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
    this.vaccinationCerts = [];
    this.covidDocumentSubmissions = [];
    this.vaccinationCerts = [];
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
          this.vaccinationCerts = this.covidDocumentSubmissions
            .filter((item) => item.covidDocumentType === 'PROOF_OF_VACCINATION')
            .sort((a, b) => {
              const dateA = moment(a.dateOfSubmission);
              const dateB = moment(b.dateOfSubmission);
              return dateB.diff(dateA);
            });

          if (this.vaccinationCerts[0]) {
            this.documentApprovalStatus =
              this.vaccinationCerts[0].documentApprovalStatus;
          }
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Cannot retrieve User Vaccination Certificate',
          });
        }
      );
  }

  onClickDownload() {
    window.open(this.user.latestProofOfVaccination, '_blank');
  }

  onCloseClick() {
    if (this.uploadProgress === -1 || this.uploadProgress === 100) {
      this.dialogRef.close();
    } else {
      this.showWarningMessage = true;
    }
  }

  renderLastUpdate() {
    if (this.vaccinationCerts[0]) {
      const date = new Date(this.vaccinationCerts[0].dateOfSubmission);
      return date;
    }
    return null;
  }
  renderVaccinationStatus() {
    if (
      this.vaccinationCerts[0]?.documentApprovalStatus.toUpperCase() ===
      'APPROVED'
    ) {
      return 'Vaccinated';
    } else if (
      this.vaccinationCerts[0]?.documentApprovalStatus.toUpperCase() ===
      'PENDING'
    ) {
      return 'Pending Approval';
    }
    return 'Not Yet Vaccinated';
  }
  renderVaccinationStyle() {
    if (
      this.vaccinationCerts[0]?.documentApprovalStatus.toUpperCase() ===
      'APPROVED'
    ) {
      return 'green';
    } else if (
      this.vaccinationCerts[0]?.documentApprovalStatus.toUpperCase() ===
      'PENDING'
    ) {
      return 'grey';
    }
    return 'red';
  }
  onSaveClick(form: NgForm) {
    this.isSubmitted = true;

    if (form.value.response === '') {
      this.invalid = true;
    } else {
      if (form.value.response === 'accept') {
        this.vaccinationCerts[0].documentApprovalStatus = 'APPROVED';
      } else {
        this.vaccinationCerts[0].documentApprovalStatus = 'REJECTED';
      }

      this.vaccinationCerts[0].dateOfApproval = new Date();

      this.covidDocumentSubmissionService
        .updateDocument(this.vaccinationCerts[0])
        .subscribe(
          (response) => {
            this.documentApprovalStatus =
              response.covidDocumentSubmission.documentApprovalStatus;

            this.isVaccinated = response.user.isVaccinated;

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
