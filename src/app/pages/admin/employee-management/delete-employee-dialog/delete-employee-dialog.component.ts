import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-delete-employee-dialog',
  templateUrl: './delete-employee-dialog.component.html',
  styleUrls: ['./delete-employee-dialog.component.css'],
})
export class DeleteEmployeeDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  onConfirmClick() {
    this.userService.deleteUser(this.data.userId).subscribe((response) => {
      this.data.confirmDelete = true;
      this.dialogRef.close({ action: 'SUCCESS' });
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
