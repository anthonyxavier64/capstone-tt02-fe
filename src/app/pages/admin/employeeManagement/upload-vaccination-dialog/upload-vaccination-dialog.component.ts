import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covidDocumentSubmission.service';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-upload-vaccination-dialog',
  templateUrl: './upload-vaccination-dialog.component.html',
  styleUrls: ['./upload-vaccination-dialog.component.css'],
  providers: [MessageService],
})

export class UploadVaccinationDialogComponent implements OnInit {
  showWarningMessage: boolean;
  uploadProgress: number;
  user: any;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService,
    private afStorage: AngularFireStorage,
  ) {
    this.uploadProgress = -1;
    this.showWarningMessage = false;
  }

  ngOnInit(): void {
    this.userService.getUser(this.config.data.userId).subscribe(
      (response) => {
        this.user = response.user;
      },
      (error) => {
        console.log(error);
      });
  }

  upload(event) {
    const currentDate = new Date().toString();

    const fileRef = this.afStorage.ref(`Vaccination_Certs/${this.user.userId}/${currentDate}`);
    const uploadTask = fileRef.put(event.target.files[0]);
    uploadTask.percentageChanges().subscribe((data) => this.uploadProgress = data);

    this.user.latestProofOfVaccination = currentDate.toString();

    const newSubmission = { dateOfSubmission: currentDate, covidDocumentType: "PROOF_OF_VACCINATION", employeeId: this.user.userId };
    this.covidDocumentSubmissionService
      .createCovidDocumentSubmission(newSubmission)
      .subscribe(
        (response) => {
          if (response.true) {
            console.log("success!", response.covidDocumentSubmission);
          } else {
            console.log("A problem has occured", response);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    this.userService.updateUserDetails(this.user).subscribe(
      (response) => {
        this.user = response.user;
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
    if (this.user?.latestProofOfVaccination) {
      const date = new Date(this.user.latestProofOfVaccination);
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
