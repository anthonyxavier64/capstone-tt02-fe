import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { throttle } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';
import { ChangePasswordComponent } from './change-password/change-password.component';

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

  fullName: string;
  contactNumber: string;

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
      this.fullName = this.user.fullName;
      this.contactNumber = this.user.contactNumber;
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

  changePasswordDialog(): void {
    let dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '250px',
      data: 'test',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.message = result;
    });
  }

  toggleEditMode(): void {
    this.fullName = this.user.fullName;
    this.contactNumber = this.user.contactNumber;
    this.editDetailsMode = !this.editDetailsMode;
  }

  closeProfileEdit(updateForm: NgForm) {
    var updatedValues = updateForm.value;
    this.editDetailsMode = false;
  }

  editDetails() {
    this.user.fullName = this.fullName;
    this.user.contactNumber = this.contactNumber;
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

  onManageLeavesClick() {
    this.router.navigateByUrl('/manage-unavailable-date');
  }

  onCovidDeclarationsClick() {
    this.router.navigateByUrl('/covid-declarations');
  }
}
