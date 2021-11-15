import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';

import { Announcement } from 'src/app/models/announcement';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';
import { ViewAnnouncementComponent } from '../admin/announcement-management/view-announcement/view-announcement.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe, MessageService],
})
export class DashboardComponent implements OnInit {
  user: any | null;

  covidAnnouncements: Announcement[];
  generalAnnouncements: Announcement[];

  physicalMeetings: any[] = [];
  virtualMeetings: any[] = [];

  physicalRsvps: any[] = [];
  virtualRsvps: any[] = [];

  allTasks: any[] = [];
  weeklyTasks: any[] = [];
  numCompleted: number;
  taskProgress: number;

  // My Weekly Meetings progress
  today = new Date();
  weekday = this.datePipe.transform(this.today, 'EEEE');
  startDate = moment().startOf('week').toDate();
  endDate = moment().endOf('week').toDate();
  weekProgress = (parseInt(moment().startOf('week').fromNow()) / 7) * 100;

  constructor(
    private router: Router,
    private announcementService: AnnouncementService,
    private meetingService: MeetingService,
    private taskService: TaskService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
<<<<<<< HEAD
    private userService: UserService,
=======
>>>>>>> 4dee3d0... toasts and delete meeting dialog style edits
    private messageService: MessageService
  ) {
    this.taskProgress = 0;
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    let cachedUser = null;
    if (currentUser) {
      cachedUser = JSON.parse(currentUser);
    }

    this.userService.getUser(cachedUser.userId).subscribe(
      (response) => {
        let user = response.user;
        if (typeof user.datesInOffice === typeof '') {
          let datesInOffice = JSON.parse(user.datesInOffice);
          this.user = {
            ...user,
            datesInOffice: datesInOffice,
          };
        } else {
          this.user = {
            ...user,
          };
        }
      },
      (error) => {}
    );

    this.announcementService
      .getCovidAnnouncements(cachedUser.companyId)
      .subscribe(
        (response) => {
          this.covidAnnouncements = response.announcements;
        },
        (error) => {
          console.log('Error obtaining covid announcements:  ' + error);
        }
      );

    this.announcementService
      .getGeneralAnnouncements(cachedUser.companyId)
      .subscribe(
        (response) => {
          this.generalAnnouncements = response.announcements;
        },
        (error) => {
          console.log('Error obtaining general announcements:  ' + error);
        }
      );

    this.taskService.getAllTasksByUser(cachedUser.userId).subscribe(
      (response) => {
        this.allTasks = response.tasks;
        this.numCompleted = 0;

        for (const task of this.allTasks) {
          if (
            moment(task.deadline).isAfter(this.startDate) &&
            moment(task.deadline).isBefore(this.endDate)
          ) {
            this.weeklyTasks.push(task);
          }
        }

        for (const wtask of this.weeklyTasks) {
          if (!!wtask.completionDate) {
            this.numCompleted++;
          }
        }
        this.taskProgress = (this.numCompleted / this.weeklyTasks.length) * 100;
      },
      (error) => {
        console.log('Error obtaining user tasks:  ' + error);
      }
    );

    this.meetingService.getAllMeetingsParticipant(cachedUser.userId).subscribe(
      (response) => {
        console.log(response);
        for (const meeting of response.physicalMeetings) {
          if (
            moment(meeting.startTime).isAfter(this.startDate) &&
            moment(meeting.startTime).isBefore(this.endDate)
          ) {
            this.physicalMeetings.push(meeting);
          }
        }

        for (const meeting of response.virtualMeetings) {
          if (
            moment(meeting.startTime).isAfter(this.startDate) &&
            moment(meeting.startTime).isBefore(this.endDate)
          ) {
            this.virtualMeetings.push(meeting);
          }
        }
      },
      (error) => {
        console.log('Error obtaining organised meetings:  ' + error);
      }
    );

    this.meetingService.getAllMeetingsRsvp(cachedUser.userId).subscribe(
      (response) => {
        for (const meeting of response.physicalRsvps) {
          this.physicalRsvps.push(meeting);
        }

        for (const meeting of response.virtualRsvps) {
          this.virtualRsvps.push(meeting);
        }
      },
      (error) => {
        console.log('Error obtaining organised meetings:  ' + error);
      }
    );
  }

  viewAnnouncement(announcement?: Announcement) {
    const viewDialog = this.matDialog.open(ViewAnnouncementComponent, {
      data: {
        title: announcement?.title,
        date: announcement?.date,
        description: announcement?.description,
      },
    });
    viewDialog.afterClosed().subscribe((result) => {
      if (result === false) {
        return;
      }
    });
  }

  handleChange(task: any) {
    if (!!task.completionDate) {
      task.completionDate = null;
      this.numCompleted--;
    } else {
      task.completionDate = new Date();
      this.numCompleted++;
    }

    this.taskService.updateTask(task).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );

    this.taskProgress = (this.numCompleted / this.weeklyTasks.length) * 100;
  }

  onCovidDeclarationsClick() {
    this.router.navigateByUrl('/covid-declarations');
  }

  acceptRsvp(meetingId: string, isPhysicalRsvp: boolean, userId: string) {
    if (this.user.datesInOffice.length < this.user.wfoMonthlyAllocation) {
      this.meetingService
        .rsvpToMeeting(meetingId, isPhysicalRsvp, userId)
        .subscribe(
          (response) => {
            var meeting = response.meeting;
            this.user.datesInOffice.push(meeting.startTime);
            if (isPhysicalRsvp) {
              if (
                moment(meeting.startTime).isAfter(this.startDate) &&
                moment(meeting.startTime).isBefore(this.endDate)
              ) {
                this.physicalMeetings.push(meeting);
                this.physicalMeetings.sort((a, b) => {
                  var aMoment = moment(a.startTime);
                  var bMoment = moment(b.startTime);
                  return aMoment.isAfter(bMoment) ? 1 : -11;
                });
              }
              var indexToRemove = this.physicalRsvps.findIndex(
                (item) => item.meetingId === meetingId
              );
              this.physicalRsvps.splice(indexToRemove, 1);
            } else {
              if (
                moment(meeting.startTime).isAfter(this.startDate) &&
                moment(meeting.startTime).isBefore(this.endDate)
              ) {
                this.virtualMeetings.push(meeting);
                this.virtualMeetings.sort((a, b) => {
                  var aMoment = moment(a.startTime);
                  var bMoment = moment(b.startTime);
                  return aMoment.isAfter(bMoment) ? 1 : -11;
                });
              }
              var indexToRemove = this.virtualRsvps.findIndex(
                (item) => item.meetingId === meetingId
              );
              this.virtualRsvps.splice(indexToRemove, 1);
            }
          },
          (error) => {
            console.log(error);
          }
<<<<<<< HEAD
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Your work from office quota limit for the month has been reached.`,
      });
    }
=======
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Meeting RSVP accepted.',
          });
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error accepting meeting RSVP.',
          });
        }
      );
>>>>>>> 4dee3d0... toasts and delete meeting dialog style edits
  }

  rejectRsvp(meetingId: string, isPhysicalRsvp: boolean, userId: string) {
    this.meetingService
      .rejectRsvpToMeeting(meetingId, isPhysicalRsvp, userId)
      .subscribe(
        (response) => {
          if (isPhysicalRsvp) {
            var indexToRemove = this.physicalRsvps.findIndex(
              (item) => item.meetingId === meetingId
            );
            this.physicalRsvps.splice(indexToRemove, 1);
          } else {
            var indexToRemove = this.virtualRsvps.findIndex(
              (item) => item.meetingId === meetingId
            );
            this.virtualRsvps.splice(indexToRemove, 1);
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Meeting RSVP rejected.',
          });
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error rejecting meeting RSVP.',
          });
        }
      );
  }
}
