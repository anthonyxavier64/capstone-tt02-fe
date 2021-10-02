import * as moment from 'moment'
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covidDocumentSubmission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

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
  covidDocumentSubmissions: any[]
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
    this.vaccinationCerts = []
  }

  ngOnInit(): void {
    this.userService.getUser(this.config.data.userId).subscribe(
      (response) => {
        this.user = response.user;
        console.log(this.user);
      },
      (error) => {
        console.log(error);
      });

    this.covidDocumentSubmissionService
      .getUserSubmissions(this.config.data.userId)
      .subscribe(
        response => {
          console.log(response);
          this.covidDocumentSubmissions = response.covidDocumentSubmissions;
          this.vaccinationCerts = this.covidDocumentSubmissions
            .filter((item) => item.covidDocumentType === "PROOF_OF_VACCINATION")
            .sort((a, b) => {
              const dateA = moment(a.dateOfSubmission);
              const dateB = moment(b.dateOfSubmission);
              return dateB.diff(dateA);
            });
        },
        error => {
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
    return "NA";
  }
  renderVaccinationStatus() {
    if (this.user?.isVaccinated) {
      return "Vaccinated";
    }
    return "Not Yet Vaccinated";
  }
  renderVaccinationStyle() {
    if (this.user?.isVaccinated) {
      return "vaccinated";
    }
    return "unvaccinated";
  }
}
