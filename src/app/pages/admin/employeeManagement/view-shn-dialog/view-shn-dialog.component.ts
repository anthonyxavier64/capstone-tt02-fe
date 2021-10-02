import * as moment from 'moment'
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covidDocumentSubmission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

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
  covidDocumentSubmissions: any[]
  mcs: any[];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private afStorage: AngularFireStorage,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
    this.covidSubmissionType = "STAY_HOME_NOTICE";
    this.remarks = "";
    this.startDate = new Date().toISOString().slice(0, 10);
    this.endDate = new Date().toISOString().slice(0, 10);
    this.covidDocumentSubmissions = [];
    this.mcs = []
  }

  ngOnInit(): void {
    this.userService.getUser(this.config.data.userId).subscribe(
      (response) => {
        this.user = response.user;
      },
      (error) => {
        console.log(error);
      });
    this.mcs = this.covidDocumentSubmissions
      .filter((item) => item.covidDocumentType === "SHN_MEDICAL_CERTIFICATE" || item.covidDocumentType === "QUARANTINE_ORDER")
      .sort((a, b) => {
        const dateA = moment(a.dateOfSubmission);
        const dateB = moment(b.dateOfSubmission);
        return dateB.diff(dateA);
      });
  }

  onClickSHN() {
    this.covidSubmissionType = "STAY_HOME_NOTICE";
  }
  onClickQO() {
    this.covidSubmissionType = "QUARANTINE_ORDER";
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
