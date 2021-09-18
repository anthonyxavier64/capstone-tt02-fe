import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';

import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { MessageService } from 'primeng/api';
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

  editDetailsMode: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    public dialog: MatDialog) {
    this.user = null;
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
      this.userService.getDepartments(this.user.email).subscribe(
        (response) => {
          this.mdept = response;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Departments not found',
          });
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
  }

  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '250px',
      data: 'test'
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.message = result;
    });
  }


  closeProfileEdit() {
    this.editDetailsMode = false;
  }
}
