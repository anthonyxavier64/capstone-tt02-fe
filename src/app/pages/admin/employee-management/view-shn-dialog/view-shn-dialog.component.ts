import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covid-document-submission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
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
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
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
    this.isVaccinated = this.config.data.isVaccinated;
    this.isSubmitted = false;
    this.invalid = false;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.userService.getUser(this.config.data.userId).subscribe(
      (response) => {
        this.user = response.user;
      },
      (error) => {
        console.log(error);
      }
    );

    this.covidDocumentSubmissionService
      .getUserSubmissions(this.config.data.userId)
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
      .deleteUser(this.config.data.selectedUser.userId)
      .subscribe((response) => {
        this.config.data.confirmDelete = true;
        this.ref.close(this.config);
      });
  }

  onCloseClick() {
    if (this.uploadProgress === -1 || this.uploadProgress === 100) {
      this.ref.close();
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
    if (this.mcs[0]?.documentApprovalStatus.toUpperCase() === "APPROVED") {
      const today = moment();
      if (today.isAfter(this.mcs[0].startDate) && today.isBefore(this.mcs[0].endDate)) {
        if (this.mcs[0].covidDocumentType === "SHN_MEDICAL_CERTIFICATE") {
          return "On stay home notice";
        } else {
          return "On quarantine order";
        }
      }
    }
    return "Fit for work";
  }
  mcApprovalStatus() {
    if (this.renderMcStatus() === "Fit for work") return "green";
    return "red";
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
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
