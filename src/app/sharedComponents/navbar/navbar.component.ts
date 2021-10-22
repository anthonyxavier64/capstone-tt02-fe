import { AdminGuideComponent } from 'src/app/pages/admin/adminLanding/admin-guide/admin-guide.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AuthService } from 'src/app/services/user/auth.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  unreadNotifications: any[]
  readNotifications: any[]
  numUnread: number
  user: any;
  accessRight: string;

  constructor(
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.unreadNotifications = [];
    this.readNotifications = [];
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.accessRight = this.user.accessRight;
    this.notificationService
      .getUnreadNotifications(this.user.userId).subscribe((response) => {
        console.log(response);
        this.unreadNotifications = response.sortedUnreadNotifications;
        this.numUnread = this.unreadNotifications.length;
      },
        (error) => {
          console.log(error);
        }
      );
    this.notificationService.getReadNotifications(this.user.userId).subscribe((response) => {
      console.log(response);
      this.readNotifications = response.readNotifications;
    },
      (error) => {
        console.log(error);
      });
    }
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  onCompanyLogoClick() {
    this.router.navigateByUrl('/admin');
  }

  onProfileLogoClick() {
    this.router.navigateByUrl('/profile');
  }

  onLogoutClick() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.auth.logout();
    this.router.navigateByUrl('/index');
    alert('Thank you for using Flexiwork, ' + currentUser.fullName + '!');
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(AdminGuideComponent, {
      width: '80%',
      height: '95%',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.message = result;
    });
  }

  onDashboardClick() {
    this.router.navigateByUrl('/dashboard');
  }

  handleGoals() {
    console.log('clicking on goals');
  }

  handleTasks() {
    this.router.navigateByUrl('/task');
  }

  handleCalendar() {
    this.router.navigateByUrl('/calendar')
  }
}
