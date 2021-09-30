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

  today = new Date();
  weekday = this.datePipe.transform(this.today, "EEEE");
  startDate = moment().startOf('week').toDate();
  endDate = moment().endOf('week').toDate();
  weekProgress = parseInt(moment().startOf('week').fromNow()) / 7 * 100; 
  
  constructor(private router: Router, 
    private userService: UserService, 
    private announcementService: AnnouncementService,
    private matDialog: MatDialog,
    private datePipe: DatePipe) 
    { let now = moment(); }

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
        console.log('********** AdminAnnouncementManagementComponent.ts: ' + error);
      }
    );

    this.announcementService.getGeneralAnnouncements(this.user.userId).subscribe(
      response => {
        this.generalAnnouncements = response.announcements;
      },
      error => {
        console.log('********** AdminAnnouncementManagementComponent.ts: ' + error);
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

}
