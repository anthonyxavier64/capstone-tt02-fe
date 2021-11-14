import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-employee-dialog',
  templateUrl: './delete-employee-dialog.component.html',
  styleUrls: ['./delete-employee-dialog.component.css'],
})
export class DeleteEmployeeDialogComponent implements OnInit {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
  ) {}

  ngOnInit(): void {}

  onConfirmClick() {
    this.userService
      .deleteUser(this.config.data.selectedUser.userId)
      .subscribe(
        (response) => {
          this.config.data.confirmDelete = true;
          this.config.data.hasBeenDeleted = true;
          this.ref.close(this.config.data);
        },
        (error) => {
          this.config.data.confirmDelete = true;
          this.config.data.hasBeenDeleted = false;
          this.ref.close(this.config.data);
        }
      );
  }

  onCloseClick() {
    this.config.data.confirmDelete = false;
    this.ref.close(this.config.data);
  }
}
