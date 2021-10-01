import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  user: any | null;
  dept: any | null;
  mdept: any | null;

  hasWFOMonthlyCap: boolean = false;
  hasWFOTeam: boolean = false;

  editDetailsMode: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {
    this.user = null;
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
      console.log(this.user.email);
      this.userService.getDepartments(this.user.email).subscribe(
        (response) => {
          this.dept = response;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Departments not found',
          });
          console.log(error);
        }
      );
      this.userService.getManagedDepartments(this.user.email).subscribe(
        (response) => {
          this.mdept = response;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Managed departments not found',
          });
        }
      );
    }

    if (this.user.wfoMonthlyAllocation) {
      this.hasWFOMonthlyCap = true;
    }

    if (this.user.alternateWfoTeam) {
      this.hasWFOTeam = true;
    }
  }

  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '250px',
      data: 'test',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.message = result;
    });
  }

  closeProfileEdit(updateForm: NgForm) {
    var updatedValues = updateForm.value;
    this.editDetailsMode = false;
  }

  editDetails() {
    this.userService.updateUserDetails(this.user).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User profile has been updated.',
        });
        this.editDetailsMode = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error has occured: $(error)',
        });
      }
    );
  }
}
