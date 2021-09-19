import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  submitted: boolean;
  user: any | null;
  oldPassword: any | null;
  newPassword: any | null;
  cfmPassword: any | null;

  resultSuccess: boolean;
  resultError: boolean;
  message: string | null;

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
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
    this.userService.resetPassword(this.user.email, this.oldPassword, this.newPassword, this.cfmPassword)
      .subscribe(
        response => {
          this.resultSuccess = true;
          this.resultError = true;
          this.message = "Your password has been reset successfully."
          this.router.navigateByUrl('/profile');
        },
        error => {
          this.resultError = true;
          this.resultSuccess = false;
          this.message = `An error has occurred: ${error}`;

          console.log("hi " + error);
        }
      )
  }

}
