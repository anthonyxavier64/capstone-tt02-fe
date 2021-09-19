import { User } from 'src/app/models/user';

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';

import { Announcement } from '../../../models/announcement';
import { AnnouncementType } from '../../../models/announcement-type';
import { AnnouncementService } from '../../../services/announcement/announcement.service';
import { ViewAnnouncementComponent } from '../../view-announcement/view-announcement.component';
import { DeleteAnnouncementComponent } from '../delete-announcement/delete-announcement.component';
import { EditAnnouncementComponent } from '../edit-announcement/edit-announcement.component';

let counter: number = 1;
@Component({
  selector: 'app-admin-announcementManagement',
  templateUrl: './adminAnnouncementManagement.component.html',
  styleUrls: ['./adminAnnouncementManagement.component.css'],
})
export class AdminAnnouncementManagementComponent implements OnInit {
  user: any;
  
  submitted: boolean;
  newAnnouncement: Announcement;
  announcementToUpdate: Announcement;
  announcementType: string | undefined;

  covidAnnouncements: Announcement[];
  generalAnnouncements: Announcement[];

  resultSuccess: boolean;
  resultError: boolean;
  message: string | undefined;

  panelOpenState: boolean;

  constructor(private announcementService: AnnouncementService,
    private matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,) {
    this.submitted = false;
    this.newAnnouncement = new Announcement();
    this.announcementToUpdate = new Announcement();
    this.covidAnnouncements = new Array();
    this.generalAnnouncements = new Array();

    this.resultSuccess = false;
    this.resultError = false;
    this.panelOpenState = false;
  }

  ngOnInit(): void {
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
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  clear() {
    this.submitted = false;
    this.newAnnouncement = new Announcement();
  }

  create(createAnnouncementForm: NgForm) {
    this.submitted = true;

    if (createAnnouncementForm.invalid) {
      this.resultError = true;
      this.resultSuccess = false;
      this.message = "An error has occurred while creating the new announcement";
      console.log('********** AdminAnnouncementManagementComponent.ts: ERROR **********');
    }

    if (this.announcementType == 'COVID_RELATED') {

      this.covidAnnouncements.push(this.newAnnouncement);
      var existingCovidAnnouncement = localStorage.getItem("covidAnnouncements");
      if (existingCovidAnnouncement != null) {
        var updatedList = Array.from(JSON.parse(existingCovidAnnouncement));
        updatedList.push(this.newAnnouncement);
        localStorage.setItem("covidAnnouncements", JSON.stringify(updatedList));
        this.newAnnouncement.announcementType = AnnouncementType.COVID_RELATED;
      }

    } else {
      this.generalAnnouncements.push(this.newAnnouncement);
      localStorage.setItem("generalAnnouncements", JSON.stringify(this.generalAnnouncements));
      this.newAnnouncement.announcementType = AnnouncementType.GENERAL;
    }

    this.newAnnouncement.date = new Date();
    this.newAnnouncement.announcementId = counter++;

    localStorage.setItem(JSON.stringify(this.newAnnouncement.announcementId), JSON.stringify(this.newAnnouncement));
    this.resultError = false;
    this.resultSuccess = true;
    this.message = `New announcement with announcement ID ${this.newAnnouncement.announcementId} created`;
    this.newAnnouncement = new Announcement();
    /*
    this.announcementService.createAnnouncement(this.announcement.title, this.announcement.description, this.announcement.announcementType).subscribe(
      response => {
        let newAnnouncementId: number = response;
        this.resultSuccess = true;
        this.resultError = false;
        this.message = "New announcement " + newAnnouncementId + " created successfully";
      },
      error => {
        this.resultError = true;
        this.resultSuccess = false;
        this.message = "An error has occurred while creating the new announcement: " + error;

        console.log(`********** AdminAnnouncementManagementComponent.ts: ${error}`);
      }
    );
    */
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
      /*this.announcementService.getAnnouncement(announcement?.announcementId).subscribe(
        response => {
          this.router.navigate(['/adminAnnouncementManagement']);
        },
        error => {
          this.resultError = true;
          this.message = error;
          console.log('********** AdminAnnouncementManagementComponent.ts: ' + error);
        }
      );*/
    });
  }

  editAnnouncement(announcement?: Announcement) {
    //this.announcementToUpdate = this.announcementService.getAnnouncement(parseInt(announcementId));
    console.log(announcement);
    const editDialog = this.matDialog.open(EditAnnouncementComponent, {
      width: '400px',
      data: {
        id: announcement?.announcementId,
        title: announcement?.title,
        date: announcement?.date,
        typeOfAnnouncement: announcement?.announcementType,
        description: announcement?.description
      }
    });

    editDialog.afterClosed().subscribe(result => {
      if (result == false) {
        return;
      }
      var temp = localStorage.getItem("updatedAnnouncement");
      if (temp != null) {
        this.announcementToUpdate = JSON.parse(temp);
        if (announcement?.announcementType === AnnouncementType.COVID_RELATED) {
          var indexToUpdate = this.covidAnnouncements.findIndex((existing) => existing === announcement)
          if (this.announcementToUpdate.announcementType === AnnouncementType.COVID_RELATED) {
            this.covidAnnouncements[indexToUpdate] = this.announcementToUpdate;
          }
          else {
            var announcementIndex = this.covidAnnouncements.findIndex(existing => { existing === announcement });
            this.covidAnnouncements.splice(announcementIndex, 1);
            localStorage.setItem("covidAnnouncements", JSON.stringify(this.covidAnnouncements));
            this.generalAnnouncements.push(this.announcementToUpdate);
            localStorage.setItem("generalAnnouncements", JSON.stringify(this.generalAnnouncements));
          }
        }
        else {
          var indexToUpdate = this.generalAnnouncements.findIndex((existing) => existing === announcement)
          if (this.announcementToUpdate.announcementType === AnnouncementType.GENERAL) {
            this.generalAnnouncements[indexToUpdate] = this.announcementToUpdate;
          }
          else {
            var announcementIndex = this.generalAnnouncements.findIndex(existing => { existing === announcement });
            this.generalAnnouncements.splice(announcementIndex, 1);
            localStorage.setItem("generalAnnouncements", JSON.stringify(this.generalAnnouncements));
            this.covidAnnouncements.push(this.announcementToUpdate);
            localStorage.setItem("covidAnnouncements", JSON.stringify(this.covidAnnouncements));
          }
        }
      }
      console.log(`Announcement To Update ID: ${this.announcementToUpdate.announcementId}, Description: ${this.announcementToUpdate.description}`);
      localStorage.setItem(JSON.stringify(this.announcementToUpdate?.announcementId), JSON.stringify(this.announcementToUpdate));

      /*
      if (result === false) {
        return;
      }
      this.announcementService.updateAnnouncement(announcementToUpdate?.announcementId,
        announcementToUpdate?.title, announcementToUpdate?.description, announcementToUpdate.announcementType ).subscribe(
        response => {
          this.router.navigate(['/adminAnnouncementManagement']);
        },
        error => {
          this.resultError = true;
          this.message = error;
          console.log('********** AdminAnnouncementManagementComponent.ts: ' + error);
        }
      );
      */
    });
  }

  deleteAnnouncement(announcement: Announcement) {
    const confirmDialog = this.matDialog.open(DeleteAnnouncementComponent, {
      data: {
        title: 'Delete Announcement Confirmation',
        message: 'Are you sure you want to delete this announcement?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === false) {
        return;
      }

      if (announcement.announcementType == AnnouncementType.COVID_RELATED) {
        var announcementIndex = this.covidAnnouncements.findIndex(existing => { existing === announcement });
        this.covidAnnouncements.splice(announcementIndex, 1);
        localStorage.setItem("covidAnnouncements", JSON.stringify(this.covidAnnouncements));
      }
      else {
        var announcementIndex = this.generalAnnouncements.findIndex(existing => { existing === announcement });
        this.generalAnnouncements.splice(announcementIndex, 1);
        localStorage.setItem("generalAnnouncements", JSON.stringify(this.generalAnnouncements));
      }

      /*
      this.announcementService.deleteAnnouncement(announcementId).subscribe(
        response => {
          this.router.navigate(['/adminAnnouncementManagement']);
        },
        error => {
          this.resultError = true;
          this.message = error;
          console.log('********** AdminAnnouncementManagementComponent.ts: ' + error);
        }
      );
      */
    });
  }
}
