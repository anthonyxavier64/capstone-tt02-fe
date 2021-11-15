import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covid-document-submission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-art-test-dialog',
  templateUrl: './art-test-dialog.component.html',
  styleUrls: ['./art-test-dialog.component.css'],
  providers: [MessageService],
})

export class ArtDialogComponent implements OnInit {
  showWarningMessage: boolean;
  uploadProgress: number;
  user: any;
  covidDocumentSubmissions: any[];
  artTests: any[]
  isPositive: boolean;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService,
    private afStorage: AngularFireStorage,
    private messageService: MessageService,
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
    this.covidDocumentSubmissions = [];
    this.artTests = [];
    this.isPositive = false;
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
          this.artTests = this.covidDocumentSubmissions
            .filter((item) => item.covidDocumentType === "ART_TEST_RESULT")
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
            detail: 'Unable to retrieve ART test result. Please try again.',
          });
        }
      );
  }

  onRadioChange() {
    this.isPositive = !this.isPositive;
  }

  upload(event) {
    const currentDate = new Date().toString();

    const fileRef = this.afStorage.ref(`ART_Results/${this.user.userId}/${currentDate}`);
    const uploadTask = fileRef.put(event.target.files[0]);
    uploadTask.percentageChanges().subscribe((data) => this.uploadProgress = data);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          console.log(url);
          this.user.latestArtTestResult = url;
          this.userService.updateUserDetails(this.user).subscribe(
            (response) => {
              console.log("updated!")
              this.user = response.user;
              localStorage.setItem("currentUser", JSON.stringify(this.user));
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User ART test result updated.',
              });
            },
            (error) => {
              console.log(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update user ART test result. Please try again.',
              });
            }
          );
        });
        const newSubmission = { dateOfSubmission: currentDate, covidDocumentType: "ART_TEST_RESULT", employeeId: this.user.userId, isPositive: this.isPositive };
        this.covidDocumentSubmissionService
          .createCovidDocumentSubmission(newSubmission)
          .subscribe(
            (response) => {
              if (response.status) {
                this.covidDocumentSubmissions.unshift(response.covidDocumentSubmission);
                this.artTests.unshift(response.covidDocumentSubmission);
                console.log(response.covidDocumentSubmission);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'ART test result uploaded successfully!',
                });
              } else {
                console.log("A problem has occured", response);
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
                detail: 'Unable to upload ART test result. Please try again.',
              });
            }
          );
      })
    ).subscribe();
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
    if (this.artTests[0]) {
      const date = new Date(this.artTests[0].dateOfSubmission);
      return date.toLocaleDateString();
    }
    return "NA";
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
    if (this.artTests[0]) {
      if (this.artTests[0].isPositive && this.artTests[0].documentApprovalStatus.toUpperCase() !== "REJECTED") {
        return 'Positive';
      }
      return 'Negative';
    }
    return 'Unsubmitted';
  }
}
