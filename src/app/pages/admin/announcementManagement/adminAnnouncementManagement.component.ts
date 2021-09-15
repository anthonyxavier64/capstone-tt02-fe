import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { EditAnnouncementComponent } from '../edit-announcement/edit-announcement.component';
import { MatDialog } from '@angular/material/dialog';

import { Announcement } from '../../../models/announcement';
import { AnnouncementService } from '../../../services/announcement/announcement.service';
import { AnnouncementType } from '../../../models/announcement-type';
import { DeleteAnnouncementComponent } from '../delete-announcement/delete-announcement.component';
import { ViewAnnouncementComponent } from '../../view-announcement/view-announcement.component';

@Component({
  selector: 'app-admin-announcementManagement',
  templateUrl: './adminAnnouncementManagement.component.html',
  styleUrls: ['./adminAnnouncementManagement.component.css'],
})
export class AdminAnnouncementManagementComponent implements OnInit {
  submitted: boolean;
  announcement: Announcement;
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
    this.announcement = new Announcement();
    this.announcementToUpdate = new Announcement();
    this.covidAnnouncements = new Array();
    this.generalAnnouncements = new Array();

    this.resultSuccess = false;
    this.resultError = false;
    this.panelOpenState = false;
  }

  ngOnInit(): void {
    this.announcementService.getCovidAnnouncements().subscribe(
      response => {
        this.covidAnnouncements = response;
      },
      error => {
        console.log('********** AdminAnnouncementManagementComponent.ts: ' + error);
      }
    );

    this.announcementService.getGeneralAnnouncements().subscribe(
      response => {
        this.generalAnnouncements = response;
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
    this.announcement = new Announcement();
  }

  create(createAnnouncementForm: NgForm) {
    this.submitted = true;

    if (createAnnouncementForm.invalid) {
      this.resultError = true;
      this.resultSuccess = false;
      this.message = "An error has occurred while creating the new announcement";
      console.log('********** AdminAnnouncementManagementComponent.ts: ERROR **********');
    }

    if (this.announcementType = 'COVID-19 Related') {
      this.announcement.announcementType = AnnouncementType.COVID_RELATED;
    }
    this.announcement.announcementType = AnnouncementType.GENERAL;
    this.announcement.date = new Date();

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
  }

  viewAnnouncement(announcement?: Announcement) {
    const confirmDialog = this.matDialog.open(ViewAnnouncementComponent, {
      data: {
        title: announcement?.title,
        date: announcement?.date,
        description: announcement?.description,
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
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
    const editDialog = this.matDialog.open(EditAnnouncementComponent, {
      data: {
        title: announcement?.title != null ? announcement.title : "Announcement",
        date: announcement?.date != null ? announcement.date : new Date(),
        description: announcement?.description != null ? announcement.description : "Description",
      }
    });

    editDialog.afterClosed().subscribe(result => {
      if (result === false) {
        return;
      }

      /*
      this.announcementService.updateAnnouncement(announcement?.announcementId,
        announcement?.title, announcement?.description, announcement.announcementType ).subscribe(
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

  deleteAnnouncement(announcementId?: number) {
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
      if (announcementId == null) {
        return;
      }
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
    });
  }
}
