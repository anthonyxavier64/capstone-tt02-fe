import { AdminGuideComponent } from 'src/app/pages/admin/adminLanding/admin-guide/admin-guide.component';
import { AuthService } from 'src/app/services/user/auth.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { FitTileStyler } from '@angular/material/grid-list/tile-styler';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

const tempNotificationData = [
  {
    notificationId: 1,
    message: "Samantha has assigned you to task 1",
    isRead: false,
    taskId: 1,
    notificationDate: new Date()
  },
  {
    notificationId: 2,
    message: "Emily has invited you to a meeting",
    isRead: false,
    meetingId: 1,
    notificationDate: new Date()
  },
  {
    notificationId: 3,
    message: "Your employee Clarence is on SHN",
    isRead: false,
    covidDocumentSubmissionId: 1,
    notificationDate: new Date()
  }
];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  notificationData: any
  numUnread: number
  constructor(
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog
  ) {
    this.notificationData = tempNotificationData;
  }

  ngOnInit(): void {
    this.notificationData.sort((first, second) => {
      if (first.isRead == second.isRead) second.notificationDate - first.notificationDate;
      if (first.isRead) return 1;
      return -1;
    })
    this.numUnread = this.notificationData.reduce((total, notif) => (!notif.isRead ? total + 1 : total), 0);
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
  chooseIcon(notification: any) {
    if (notification.taskId) {
      return "../../../assets/images/online-meeting.png";
    } else if (notification.meetingId) {
      return "../../../assets/images/to-do-list.png";
    } else if (notification.covidDocumentSubmissionId) {
      return "../../../assets/images/stethoscope.png";
    }
    return "";
  }
  onClickNotification(notification: any) {
    if (notification.taskId) {
      this.router.navigateByUrl('/task');
    } else if (notification.meetingId) {
      this.router.navigateByUrl('/meeting');
    } else if (notification.covidDocumentSubmissionId) {
      this.router.navigateByUrl('/adminEmployeeManagement');
    }
  }
}
