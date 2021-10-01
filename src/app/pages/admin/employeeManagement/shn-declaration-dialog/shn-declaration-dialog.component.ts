import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-shn-declaration-dialog',
  templateUrl: './shn-declaration-dialog.component.html',
  styleUrls: ['./shn-declaration-dialog.component.css'],
  providers: [ MessageService ],
})

export class ShnDeclarationDialogComponent implements OnInit {
  remarks: string;
  showWarningMessage: boolean;
  uploadProgress: number;
  user: any;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
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
    const currentDate  = new Date().toString();

    const fileRef = this.afStorage.ref(`SHN_QO_Declarations/${this.user.userId}/${currentDate}`);
    const uploadTask = fileRef.put(event.target.files[0]);
    uploadTask.percentageChanges().subscribe((data) => this.uploadProgress = data);

    this.user.latestProofOfVaccination = currentDate.toString()

    this.userService.updateUserDetails(this.user).subscribe(
      (response) => {
        this.user = response.user;
      },
      (error) => {
        console.log(error);
      }
    );;
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
