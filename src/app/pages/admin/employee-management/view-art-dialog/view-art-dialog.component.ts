import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covid-document-submission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
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
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private afStorage: AngularFireStorage,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
    this.covidDocumentSubmissions = [];
    this.artTests = [];
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
        }
      );
  }
  onConfirmClick() {
    this.userService
      .deleteUser(this.config.data.selectedUser.userId)
      .subscribe((response) => {
        this.config.data.confirmDelete = true;
        this.ref.close(this.config);
      });
  }
  onClickDownload() {
    window.open(this.user.latestArtTestResult, '_blank');
  }

  onCloseClick() {
    if (this.uploadProgress === -1 || this.uploadProgress === 100) {
      this.ref.close();
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
    if (this.artTests[0]?.documentApprovalStatus.toUpperCase() === "APPROVED") {
      if (this.artTests[0].isPositive) {
        return "red";
      }
      return "green";
    }
    return "grey";
  }
  renderFetApprovalStatus() {
    if (this.artTests[0]?.documentApprovalStatus.toUpperCase() === "APPROVED") {
      if (this.artTests[0].isPositive) {
        return "Positive";
      }
    }
    return "Negative";
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
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
