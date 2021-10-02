import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

import { UserService } from 'src/app/services/user/user.service';

import { Announcement } from 'src/app/models/announcement';
import { ViewAnnouncementComponent } from '../view-announcement/view-announcement.component';
import { AnnouncementType } from 'src/app/models/announcement-type';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';

import { MeetingService } from 'src/app/services/meeting/meeting.service';

import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  user: any | null;

  covidAnnouncements: Announcement[];
  generalAnnouncements: Announcement[];

  organisedMeetings: any[];

  weeklyTasks: any[];
  numCompleted: number;
  taskProgress: number;

  // My Weekly Tasks progress
  
  // My Weekly Meetings progress
  today = new Date();
  weekday = this.datePipe.transform(this.today, "EEEE");
  startDate = moment().startOf('week').toDate();
  endDate = moment().endOf('week').toDate();
  weekProgress = parseInt(moment().startOf('week').fromNow()) / 7 * 100; 
  
  constructor(private router: Router, 
    private userService: UserService, 
    private announcementService: AnnouncementService,
    private meetingService: MeetingService,
    private taskService: TaskService,
    private matDialog: MatDialog,
    private datePipe: DatePipe) 
    { let now = moment(); 
      this.taskProgress = 0;
    }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }

    this.announcementService.getCovidAnnouncements(this.user.userId).subscribe(
      response => {
        this.covidAnnouncements = response.announcements;
      },
      error => {
        console.log("Error obtaining covid announcements:  " + error);
      }
    );

    this.announcementService.getGeneralAnnouncements(this.user.userId).subscribe(
      response => {
        this.generalAnnouncements = response.announcements;
      },
      error => {
        console.log("Error obtaining general announcements:  " + error);
      }
    );

    this.taskService.getAllTasksByUser(this.user.userId).subscribe(
      response => {
        this.weeklyTasks = response.tasks;
        this.numCompleted = 0;

        for (const task of this.weeklyTasks) {
          if (!!task.completionDate) {
            this.numCompleted++;
          }
        }
        this.taskProgress = (this.numCompleted / this.weeklyTasks.length) * 100;
      },
      error => {
        console.log("Error obtaining user tasks:  " + error);
      }
    );

    this.meetingService.getAllMeetingsOrganiser(this.user.userId).subscribe(
      response => {
        this.organisedMeetings = response.meetings;
      },
      error => {
        console.log("Error obtaining organised meetings:  " + error);
      }
    );
  
  }

  viewAnnouncement(announcement?: Announcement) {
    const viewDialog = this.matDialog.open(ViewAnnouncementComponent, {
      data: {
        title: announcement?.title,
        date: announcement?.date,
        description: announcement?.description,
      }
    });
    viewDialog.afterClosed().subscribe(result => {
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

}
