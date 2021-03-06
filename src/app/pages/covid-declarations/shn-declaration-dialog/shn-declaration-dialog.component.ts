import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covid-document-submission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-shn-declaration-dialog',
  templateUrl: './shn-declaration-dialog.component.html',
  styleUrls: ['./shn-declaration-dialog.component.css'],
  providers: [MessageService],
})
export class ShnDeclarationDialogComponent implements OnInit {
  covidSubmissionType: string;
  remarks: string;
  startDate: string;
  endDate: string;
  showWarningMessage: boolean;
  uploadProgress: number;
  user: any;
  covidDocumentSubmissions: any[];
  mcs: any[];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private afStorage: AngularFireStorage,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService,
    private messageService: MessageService,
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
    this.covidSubmissionType = 'SHN_MEDICAL_CERTIFICATE';
    this.remarks = '';
    this.startDate = new Date().toISOString().slice(0, 10);
    this.endDate = new Date().toISOString().slice(0, 10);
    this.covidDocumentSubmissions = [];
    this.mcs = [];
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    this.covidDocumentSubmissionService
      .getUserSubmissions(this.config.data.userId)
      .subscribe(
        response => {
          console.log(response);
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
        },
        error => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to retrieve medical certificates. Please try again.',
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

  upload(event) {
    const currentDate = new Date().toString();

    const fileRef = this.afStorage.ref(
      `SHN_QO_Declarations/${this.user.userId}/${currentDate}`
    );
    const uploadTask = fileRef.put(event.target.files[0]);
    uploadTask
      .percentageChanges()
      .subscribe((data) => (this.uploadProgress = data));
    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            console.log(url);
            this.user.latestMedicalCert = url;
            this.userService.updateUserDetails(this.user).subscribe(
              (response) => {
                console.log('updated!');
                this.user = response.user;
                localStorage.setItem('currentUser', JSON.stringify(this.user));
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'User medical certificates updated.',
                });
              },
              (error) => {
                console.log(error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to update user medical certificates. Please try again.',
                });
              }
            );
          });
          this.user.latestMedicalCert = currentDate.toString();
          const newSubmission = {
            dateOfSubmission: currentDate,
            remarks: this.remarks,
            startDate: this.startDate,
            endDate: this.endDate,
            covidDocumentType: this.covidSubmissionType,
            employeeId: this.user.userId,
          };
          this.covidDocumentSubmissionService
            .createCovidDocumentSubmission(newSubmission)
            .subscribe(
              (response) => {
                if (response.status) {
                  console.log('success!', response.covidDocumentSubmission);
                  this.covidDocumentSubmissions.unshift(response.covidDocumentSubmission);
                  this.mcs.unshift(response.covidDocumentSubmission);
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Medical certificate uploaded successfully!',
                  });
                } else {
                  console.log('A problem has occured', response);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'A problem has occurred when uploading. Please try again.',
                  });
                }
              },
              (error) => {
                console.log(error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Unable to upload medical certificate. Please try again.',
                });
              }
            );
        })
      )
      .subscribe();
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
      return date.toLocaleDateString();
    }
    return 'NA';
  }

  renderMcStatus() {
    const today = new Date();
    //console.log(today);
    const endDate = new Date(this.mcs[0]?.endDate);
    endDate.setHours(23, 59, 59);
    console.log(endDate);

    if (this.mcs[0]?.documentApprovalStatus !== 'REJECTED' && (today >= new Date(this.mcs[0]?.startDate)) && (today <= endDate)) {
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
    if (this.mcs[0]?.documentApprovalStatus !== 'REJECTED' && (today >= new Date(this.mcs[0]?.startDate)) && (today <= endDate)) {
      if (this.mcs[0]?.documentApprovalStatus.toUpperCase() === 'APPROVED') {
        return 'red';
      } else if (this.mcs[0]?.documentApprovalStatus.toUpperCase() === 'PENDING') {
        return 'grey';
      }
    }
    return 'green';
  }
}
