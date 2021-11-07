import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminGuideComponent } from 'src/app/pages/admin/admin-landing/admin-guide/admin-guide.component';
import { ViewArtComponent } from 'src/app/pages/admin/employee-management/view-art-dialog/view-art-dialog.component';
import { ViewShnDeclarationDialog } from 'src/app/pages/admin/employee-management/view-shn-dialog/view-shn-dialog.component';
import { ViewVaccinationDialogComponent } from 'src/app/pages/admin/employee-management/view-vaccination-dialog/view-vaccination-dialog.component';
import { TaskDetailDialogComponent } from 'src/app/pages/employee/task/task-detail-dialog/task-detail-dialog.component';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covidDocumentSubmission.service';
import { GoalService } from 'src/app/services/goal/goal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { TaskService } from 'src/app/services/task/task.service';
import { AuthService } from 'src/app/services/user/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DialogService],
})
export class NavbarComponent implements OnInit {
  unreadNotifications: any[];
  readNotifications: any[];
  numUnread: number;
  user: any;
  ref: DynamicDialogRef | undefined;
  accessRight: string;

  constructor(
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private taskService: TaskService,
    private goalService: GoalService,
    private userService: UserService,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService
  ) {
    this.unreadNotifications = [];
    this.readNotifications = [];
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.accessRight = this.user.accessRight;
  }

  ngOnInit(): void {
    this.notificationService.getUnreadNotifications(this.user.userId).subscribe(
      (response) => {
        this.unreadNotifications = response.sortedUnreadNotifications;
        this.numUnread = this.unreadNotifications.length;
      },
      (error) => {
        console.log(error);
      }
    );
    this.notificationService.getReadNotifications(this.user.userId).subscribe(
      (response) => {
        this.readNotifications = response.readNotifications;
      },
      (error) => {
        console.log(error);
      }
    );
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
    this.router.navigateByUrl('/goals');
  }

  handleTasks() {
    this.router.navigateByUrl('/task');
  }

  handleCalendar() {
    this.router.navigateByUrl('/calendar');
  }
  chooseIcon(notification: any) {
    if (notification.taskId) {
      return '../../../assets/images/online-meeting.png';
    } else if (notification.meetingId) {
      return '../../../assets/images/to-do-list.png';
    } else if (notification.covidDocumentSubmissionId) {
      return '../../../assets/images/stethoscope.png';
    } else if (notification.commentId) {
      return '../../../assets/images/bubble-chat.png';
    }
    return '';
  }
  onClickNotification(notification: any) {
    if (!notification.isRead) {
      notification.isRead = true;
      this.notificationService.updateNotification(notification).subscribe(
        (response) => {
          const filterUnread = this.unreadNotifications.filter((item) => {
            return item.notificationId !== notification.notificationId;
          });

          this.unreadNotifications = [...filterUnread];

          this.readNotifications.push(response.notification);
          this.readNotifications = this.readNotifications.sort(
            (first, second) => second.notificationDate - first.notificationDate
          );
          this.numUnread--;
        },
        (error) => {
          console.log(error);
        }
      );
    }
    if (notification.taskId) {
      this.taskService.getTaskById(notification.taskId).subscribe(
        (response) => {
          const task = response.task;

          this.goalService
            .getAllGoalsByCompanyId(this.user.companyId)
            .subscribe(
              (response) => {
                const goals = response.goals;

                const goal = goals.filter(
                  (goal) => goal.goalId === task.goalId
                );

                const employees = task.employees;
                const isSupervisor =
                  this.user.userId === task.userId ? true : false;

                this.ref = this.dialogService.open(TaskDetailDialogComponent, {
                  data: {
                    goal,
                    allGoals: goals,
                    task,
                    employees,
                    isArchived: task.isArchived,
                    isSupervisor,
                  },
                  width: '80%',
                  height: 'auto',
                  closable: false,
                  showHeader: false,
                });
              },
              (error) => {
                throw new Error(error);
              }
            );
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (notification.meetingId) {
      this.router.navigateByUrl('/update-meeting/' + notification.meetingId);
    } else if (notification.covidDocumentSubmissionId) {
      this.covidDocumentSubmissionService
        .getCovidDocumentSubissionById(notification.covidDocumentSubmissionId)
        .subscribe(
          (response) => {
            // open submission dialog

            const { submission, user } = response;

            if (submission.covidDocumentType === 'PROOF_OF_VACCINATION') {
              this.ref = this.dialogService.open(
                ViewVaccinationDialogComponent,
                {
                  header: user.fullName + "'s Vaccination Certificate",
                  width: '70%',
                  contentStyle: { 'max-height': '50vw', overflow: 'auto' },
                  data: user,
                }
              );
            } else if (submission.covidDocumentType === 'ART_TEST_RESULT') {
              this.ref = this.dialogService.open(ViewArtComponent, {
                header: user.fullName + "'s ART Tests",
                width: '70%',
                contentStyle: { 'max-height': '50vw', overflow: 'auto' },
                data: user,
              });
            } else {
              this.ref = this.dialogService.open(ViewShnDeclarationDialog, {
                header: user.fullName + "'s SHN/QO Declaration",
                width: '70%',
                contentStyle: { 'max-height': '50vw', overflow: 'auto' },
                data: user,
              });
            }
          },
          (error) => {
            // toast
            console.log(error);
          }
        );
    }
  }
}
