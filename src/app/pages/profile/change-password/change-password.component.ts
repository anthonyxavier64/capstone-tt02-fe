import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [MessageService],
})
export class ChangePasswordComponent implements OnInit {
  submitted: boolean;
  user: any | null;
  oldPassword: any | null;
  newPassword: any | null;
  cfmPassword: any | null;

  resultSuccess: boolean;
  message: string | null;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.submitted = false;
    this.user = null;
    this.oldPassword = '';
    this.newPassword = '';
    this.cfmPassword = '';
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }

  save(changePasswordForm: NgForm) {
    if (changePasswordForm.invalid) {
      this.message = 'Please fill in all required fields.';
      return;
    } else {
      this.userService
        .resetPassword(
          this.user.userId,
          this.oldPassword,
          this.newPassword,
          this.cfmPassword
        )
        .subscribe(
          (response) => {
            this.dialogRef.close({ action: 'SUCCESS' });
          },
          (error) => {
            if (this.newPassword != this.cfmPassword) {
              this.message = 'New passwords are not matching!';
            } else {
              this.message = 'Given old password is invalid!';
            }
          }
        );
    }
  }
}
