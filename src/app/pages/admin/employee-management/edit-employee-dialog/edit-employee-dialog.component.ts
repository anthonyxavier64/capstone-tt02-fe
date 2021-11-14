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
  fullName: string;
  contactNumber: number;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService
  ) {
    console.log(config.data);
    this.fullName = config.data.fullName;
    this.contactNumber = config.data.contactNumber;
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
        this.config.data.confirmEdit = true;
        this.config.data.hasBeenUpdated = true;
        this.ref.close(this.config.data);
      },
      (error) => {
        this.config.data.confirmEdit = true;
        this.config.data.hasBeenUpdated = false;
        this.ref.close(this.config.data);
        console.log(error);
      }
    );
  }

  onCloseClick() {
    this.config.data.confirmEdit = false;
    this.ref.close(this.config.data);
  }
}
