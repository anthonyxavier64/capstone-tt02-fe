import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.css'],
})
export class EditEmployeeDialogComponent implements OnInit {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    console.log(config.data);
  }

  ngOnInit(): void {}

  saveDetails(form: NgForm) {
    var formValue = form.value;
    if (formValue.fullName !== '') {
      this.config.data.fullName = formValue.fullName;
    }
    if (formValue.email !== '') {
      this.config.data.email = formValue.email;
    }
    if (formValue.contactNumber !== '') {
      this.config.data.email = formValue.contactNumber;
    }

    //ADD EDIT BE LOGIC HERE

    this.ref.close(this.config.data);
  }

  onCloseClick() {
    this.ref.close();
  }
}
