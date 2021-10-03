import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covidDocumentSubmission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
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
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
    this.vaccinationCerts = [];
    this.covidDocumentSubmissions = [];
    this.vaccinationCerts = [];
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
        }
      );
  }

  onClickDownload() {
    window.open(this.user.latestProofOfVaccination, '_blank');
  }

  onCloseClick() {
    if (this.uploadProgress === -1 || this.uploadProgress === 100) {
      this.ref.close();
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
    if (this.isVaccinated) {
      return 'Vaccinated';
    }
    return 'Not Yet Vaccinated';
  }
  renderVaccinationStyle() {
    if (this.isVaccinated) {
      return 'vaccinated';
    }
    return 'unvaccinated';
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
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
