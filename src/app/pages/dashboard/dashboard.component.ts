import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Announcement } from 'src/app/models/announcement';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';
import { ViewAnnouncementComponent } from '../view-announcement/view-announcement.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit {
  user: any | null;

  covidAnnouncements: Announcement[];
  generalAnnouncements: Announcement[];

  oMeetings: any[] = [];
  pMeetings: any[] = [];
  weeklyMeetings: any[] = [];

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
    private userService: UserService,
    private announcementService: AnnouncementService,
    private meetingService: MeetingService,
    private taskService: TaskService,
    private matDialog: MatDialog,
    private datePipe: DatePipe
  ) {
    let now = moment();
    this.taskProgress = 0;
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }

    this.announcementService
      .getCovidAnnouncements(this.user.companyId)
      .subscribe(
        (response) => {
          this.covidAnnouncements = response.announcements;
        },
        (error) => {
          console.log('Error obtaining covid announcements:  ' + error);
        }
      );

    this.announcementService
      .getGeneralAnnouncements(this.user.companyId)
      .subscribe(
        (response) => {
          this.generalAnnouncements = response.announcements;
        },
        (error) => {
          console.log('Error obtaining general announcements:  ' + error);
        }
      );

    this.taskService.getAllTasksByUser(this.user.userId).subscribe(
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

    this.meetingService.getAllMeetingsOrganiser(this.user.userId).subscribe(
      (response) => {
        this.oMeetings = response.meetings;

        for (const meeting of this.oMeetings) {
          if (
            moment(meeting.startTime).isAfter(this.startDate) &&
            moment(meeting.startTime).isBefore(this.endDate)
          ) {
            this.weeklyMeetings.push(meeting);
          }
        }
      },
      (error) => {
        console.log('Error obtaining organised meetings:  ' + error);
      }
    );

    this.meetingService.getAllMeetingsParticipant(this.user.userId).subscribe(
      (response) => {
        for (const meeting of response.physicalMeetings) {
          this.pMeetings.push(meeting);
        }

        for (const meeting of response.virtualMeetings) {
          this.pMeetings.push(meeting);
        }

        for (const meeting of this.pMeetings) {
          if (
            moment(meeting.startTime).isAfter(this.startDate) &&
            moment(meeting.startTime).isBefore(this.endDate)
          ) {
            this.weeklyMeetings.push(meeting);
          }
        }

        for (const meeting of this.weeklyMeetings) {
          console.log(meeting);
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
}
