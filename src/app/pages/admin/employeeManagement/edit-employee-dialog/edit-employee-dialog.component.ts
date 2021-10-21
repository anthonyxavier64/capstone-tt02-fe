import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from 'src/app/services/user/user.service';

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.css'],
})
export class EditEmployeeDialogComponent implements OnInit {
  
  user: any;
  isAdmin: boolean;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService
  ) {
    console.log(config.data);
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    if (this.config.data.accessRight === 'ADMIN') {
      this.isAdmin = true;
    } else if (this.config.data.accessRight === 'GENERAL') {
      this.isAdmin = false;
    }
  }

  saveDetails(form: NgForm) {
    var formValue = form.value;
    if (formValue.fullName !== '') {
      this.config.data.fullName = formValue.fullName;
    }
    if (formValue.contactNumber !== '') {
      this.config.data.contactNumber = formValue.contactNumber;
    }
    if (formValue.isAdmin === true) {
      this.config.data.accessRight = 'ADMIN';
    }
    if (formValue.isAdmin === false) {
      this.config.data.accessRight = 'GENERAL';
    }

    this.userService.updateUserDetails(this.config.data).subscribe(
      (response) => {
        this.ref.close(this.config.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onCloseClick() {
    this.ref.close();
  }
}
