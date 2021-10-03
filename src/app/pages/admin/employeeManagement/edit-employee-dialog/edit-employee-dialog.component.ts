import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.css'],
})
export class EditEmployeeDialogComponent implements OnInit {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService
  ) {
    console.log(config.data);
  }

  ngOnInit(): void {}

  saveDetails(form: NgForm) {
    var formValue = form.value;
    if (formValue.fullName !== '') {
      this.config.data.fullName = formValue.fullName;
    }
    if (formValue.contactNumber !== '') {
      this.config.data.contactNumber = formValue.contactNumber;
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
