import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Announcement } from '../../../models/announcement';
import { AnnouncementType } from '../../../models/announcement-type';
import { AnnouncementService } from '../../../services/announcement/announcement.service';
import { ViewAnnouncementComponent } from './view-announcement/view-announcement.component';
import { DeleteAnnouncementComponent } from './delete-announcement/delete-announcement.component';
import { EditAnnouncementComponent } from './edit-announcement/edit-announcement.component';

let counter: number = 1;
@Component({
  selector: 'app-admin-announcementManagement',
  templateUrl: './admin-announcement-management.component.html',
  styleUrls: ['./admin-announcement-management.component.css'],
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

  constructor(
    private announcementService: AnnouncementService,
    private matDialog: MatDialog,
    private location: Location
  ) {
    this.submitted = false;
    this.newAnnouncement = new Announcement();
    this.announcementToUpdate = new Announcement();
    this.covidAnnouncements = new Array();
    this.generalAnnouncements = new Array();

    this.resultSuccess = false;
    this.panelOpenState = false;
  }

  ngOnInit(): void {
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
          console.log(
            '********** AdminAnnouncementManagementComponent.ts: ' + error
          );
        }
      );

    this.announcementService
      .getGeneralAnnouncements(this.user.companyId)
      .subscribe(
        (response) => {
          this.generalAnnouncements = response.announcements;
        },
        (error) => {
          console.log(
            '********** AdminAnnouncementManagementComponent.ts: ' + error
          );
        }
      );
  }

  onBackClick() {
    this.location.back();
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
      this.resultSuccess = false;
      this.message =
        'An error has occurred while creating the new announcement';
    }

    this.resultSuccess = true;
    this.newAnnouncement.date = new Date();
    this.newAnnouncement.announcementType =
      AnnouncementType[this.announcementType];
    this.newAnnouncement.senderId = this.user.userId;

    this.newAnnouncement.companyId = this.user.companyId;
    this.announcementService.createAnnouncement(this.newAnnouncement).subscribe(
      (response) => {
        this.resultSuccess = response.status;
        if (response.status) {
          if (
            this.newAnnouncement.announcementType ===
            AnnouncementType.COVID_RELATED
          ) {
            this.covidAnnouncements.push(response.announcement);
          } else {
            this.generalAnnouncements.push(response.announcement);
          }
          this.message =
            'New announcement with id ' +
            response.announcement.announcementId +
            ' created successfully';
        } else {
          this.message = 'An error has occured: ' + response.message;
        }
      },
      (error) => {
        this.resultSuccess = false;
        this.message =
          'An error has occurred while creating the new announcement: ' + error;
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

  editAnnouncement(announcement: Announcement) {
    const editDialog = this.matDialog.open(EditAnnouncementComponent, {
      width: '400px',
      data: {
        announcementId: announcement.announcementId,
        title: announcement?.title,
        date: announcement?.date,
        typeOfAnnouncement: announcement?.announcementType,
        description: announcement?.description,
      },
    });

    editDialog.afterClosed().subscribe((result) => {
      const newAnnouncement = result;
      newAnnouncement.announcementId = announcement.announcementId;
      this.announcementService
        .updateAnnouncement(newAnnouncement)
        .subscribe((response) => {
          if (!response.status) {
            this.resultSuccess = false;
            this.message =
              'An error has occurred while editing: ' + response.message;
          } else {
            this.submitted = true;
            this.resultSuccess = true;
            const updatedAnnouncement = response.announcement;
            this.message =
              'Announcement with id: ' +
              updatedAnnouncement.announcementId +
              ' updated successfully';

            if (
              announcement.announcementType === AnnouncementType.COVID_RELATED
            ) {
              var announcementIndex = this.covidAnnouncements.findIndex(
                (existing) => {
                  existing === announcement;
                }
              );
              this.covidAnnouncements.splice(announcementIndex, 1);
            } else {
              var announcementIndex = this.generalAnnouncements.findIndex(
                (existing) => {
                  existing === announcement;
                }
              );
              this.generalAnnouncements.splice(announcementIndex, 1);
            }

            if (
              updatedAnnouncement.announcementType ===
              AnnouncementType.COVID_RELATED
            ) {
              this.covidAnnouncements.push(updatedAnnouncement);
            } else {
              this.generalAnnouncements.push(updatedAnnouncement);
            }
          }
        });
    });
  }

  deleteAnnouncement(announcement: Announcement) {
    const confirmDialog = this.matDialog.open(DeleteAnnouncementComponent, {
      data: {
        title: 'Delete Announcement Confirmation',
        message: 'Are you sure you want to delete this announcement?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === false) {
        return;
      }

      this.announcementService
        .deleteAnnouncement(announcement.announcementId)
        .subscribe((response) => {
          if (!response.status) {
            this.message = 'Unable to delete announcement: ' + response.message;
            return;
          }
          this.message =
            'Announcement with id: ' +
            announcement.announcementId +
            ' deleted successfully';
          if (announcement.announcementType == AnnouncementType.COVID_RELATED) {
            var announcementIndex = this.covidAnnouncements.findIndex(
              (existing) => {
                existing === announcement;
              }
            );
            this.covidAnnouncements.splice(announcementIndex, 1);
          } else {
            var announcementIndex = this.generalAnnouncements.findIndex(
              (existing) => {
                existing === announcement;
              }
            );
            this.generalAnnouncements.splice(announcementIndex, 1);
          }
        });
    });
  }
}
