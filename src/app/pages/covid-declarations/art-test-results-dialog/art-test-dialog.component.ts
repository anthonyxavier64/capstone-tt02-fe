import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covidDocumentSubmission.service';
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
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService,
    private afStorage: AngularFireStorage,
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
    this.covidDocumentSubmissions = [];
    this.artTests = [];
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
        }
      );
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
            },
            (error) => {
              console.log(error);
            }
          );
        });
      })
    ).subscribe();
    const newSubmission = { dateOfSubmission: currentDate, covidDocumentType: "ART_TEST_RESULT", employeeId: this.user.userId };
    this.covidDocumentSubmissionService
      .createCovidDocumentSubmission(newSubmission)
      .subscribe(
        (response) => {
          if (response.status) {
            console.log(response.covidDocumentSubmission);
          } else {
            console.log("A problem has occured", response);
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
