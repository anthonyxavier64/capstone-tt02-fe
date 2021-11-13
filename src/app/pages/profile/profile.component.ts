import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { UserService } from 'src/app/services/user/user.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  user: any | null;
  dept: any[] = [];
  mdept: any[] = [];
  company: any | null;

  fullName: string;
  contactNumber: string;

  hasWFOMonthlyCap: boolean = false;
  hasWFOTeam: boolean = false;

  editDetailsMode: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private companyService: CompanyService,
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

      this.companyService.getCompany(this.user.companyId).subscribe(
        (response) => {
          this.company = response.company;

          if (this.company.wfoArrangement === 'OFFICE_QUOTAS') {
            this.hasWFOMonthlyCap = true;
          } else if (this.company.wfoArrangement === 'ALTERNATE_WORK_TEAMS') {
            this.hasWFOTeam = true;
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error retrieving company.',
          });
          console.log(error);
        }
      );
      console.log(this.user);

      this.userService.getDepartments(this.user.userId).subscribe(
        (response) => {
          this.dept = response.dept;
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
      this.userService.getManagedDepartments(this.user.userId).subscribe(
        (response) => {
          this.mdept = response.mdept;
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

  changePasswordDialog(): void {
    let dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '250px',
      data: 'test',
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response.action === 'SUCCESS') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Password changed successfully.`,
        });
      }
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
