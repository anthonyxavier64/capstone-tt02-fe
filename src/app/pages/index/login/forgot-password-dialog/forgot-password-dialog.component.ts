import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css'],
})
export class ForgotPasswordDialogComponent implements OnInit {
  emailAddress: string;

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  resetPassword(): void {
    this.userService.getUserByEmail(this.emailAddress).subscribe(
      (response) => {
        let user = response.user;
        this.userService.forgotPassword(this.emailAddress).subscribe(
          (response) => {
            this.dialogRef.close({ action: 'RESET', email: this.emailAddress });
          },
          (error) => {
            console.log(error);
            this.dialogRef.close({ action: 'ERROR'});
          }
        );
      },
      (error) => {
        const errorMessage = error.error.message;
        this.dialogRef.close({ action: 'NOT_FOUND', message: errorMessage });
      }
    );
  }

  close(): void {
    this.dialogRef.close({ action: 'CLOSED' });
  }
}
