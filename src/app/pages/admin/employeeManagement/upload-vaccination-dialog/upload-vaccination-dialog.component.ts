import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-upload-vaccination-dialog',
  templateUrl: './upload-vaccination-dialog.component.html',
  styleUrls: ['./upload-vaccination-dialog.component.css'],
})
export class UploadVaccinationDialogComponent implements OnInit {
  uploadProgress: number;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private afStorage: AngularFireStorage
  ) {
    this.uploadProgress = 0;
  }

  ngOnInit(): void {
  }

  upload(event) {
    const currentUser = localStorage.getItem('currentUser');
    const { email } = JSON.parse(currentUser);
    const now  = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const fileRef = this.afStorage.ref(`Vaccination_Certs/${email}/${currentDate}`);
    const uploadTask = fileRef.put(event.target.files[0]);
    uploadTask.percentageChanges().subscribe((data) => this.uploadProgress = data);

    console.log(this.uploadProgress);
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
    this.ref.close();
  }

}
