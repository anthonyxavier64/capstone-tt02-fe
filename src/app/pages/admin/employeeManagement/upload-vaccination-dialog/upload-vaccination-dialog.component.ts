import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-vaccination-dialog',
  templateUrl: './upload-vaccination-dialog.component.html',
  styleUrls: ['./upload-vaccination-dialog.component.css'],
})
export class UploadVaccinationDialogComponent implements OnInit {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

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
