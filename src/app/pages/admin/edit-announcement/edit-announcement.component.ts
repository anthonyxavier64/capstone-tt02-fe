import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Announcement } from 'src/app/models/announcement';
import { AnnouncementType } from '../../../models/announcement-type';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-announcement',
  templateUrl: './edit-announcement.component.html',
  styleUrls: ['./edit-announcement.component.css']
})
export class EditAnnouncementComponent implements OnInit {

  submitted: boolean;
  announcementId: number | undefined;
  titleToUpdate: string | undefined;
  date: Date | undefined;
  descriptionToUpdate: string | undefined;
  announcementToUpdate: Announcement;
  announcementType: string | undefined;
  retrieveAnnouncementError: boolean;

  resultSuccess: boolean;
  resultError: boolean;
  message: string | undefined;


  constructor(public dialogRef: MatDialogRef<EditAnnouncementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private announcementService: AnnouncementService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.submitted = false;
    this.announcementToUpdate = new Announcement();

    this.announcementId = this.data.id;
    this.titleToUpdate = this.data.title;
    this.date = this.data.date;
    this.announcementType = this.data.typeOfAnnouncement;
    this.descriptionToUpdate = this.data.description;

    this.retrieveAnnouncementError = false;
    this.resultError = false;
    this.resultSuccess = false;
  }

  ngOnInit(): void {
    /*
    this.announcementId = this.activatedRoute.snapshot.paramMap.get('announcementId');

    if (this.announcementId == null) {
      return;
    }

    this.announcementService.getAnnouncement(parseInt(this.announcementId)).subscribe(
      response => {
        this.announcementToUpdate = response;
      },
      error => {
        console.log('********** EditAnnouncementComponent.ts: ' + error);
      }
    );
    */
  }

  save(updateAnnouncementForm: NgForm) {
    if (this.announcementId == null) {
      return;
    }

    if (updateAnnouncementForm.invalid) {
      this.resultError = true;
      this.resultSuccess = false;
      this.message = "Failed to edit announcement";
      return;
    }
    this.submitted = true;
    this.resultSuccess = true;
    this.resultError = false;
    this.message = "Announcement updated successfully";
    if (this.announcementType == 'COVID_RELATED') {
      this.announcementToUpdate.announcementType = AnnouncementType.COVID_RELATED
    }
    else {
      this.announcementToUpdate.announcementType = AnnouncementType.GENERAL;
    }
    this.announcementToUpdate.announcementId = this.announcementId;
    this.announcementToUpdate.date = this.date;
    this.announcementToUpdate.description = this.descriptionToUpdate;
    this.announcementToUpdate.title = this.titleToUpdate;

    console.log(this.announcementToUpdate);


    localStorage.setItem("updatedAnnouncement", JSON.stringify(this.announcementToUpdate));
    console.log(localStorage.getItem("updatedAnnouncement"));
    this.dialogRef.close(this.announcementToUpdate);
  }

  update(updateAnnouncementForm: NgForm) {
    this.submitted = true;

    if (updateAnnouncementForm.invalid) {
      this.resultError = true;
      this.resultSuccess = false;
      return;
    }

    if (this.announcementType == 'COVID_RELATED') {
      this.announcementToUpdate.announcementType = AnnouncementType.COVID_RELATED;
    }
    this.announcementToUpdate.announcementType = AnnouncementType.GENERAL;
    this.announcementToUpdate.date = new Date();

    this.announcementService.updateAnnouncement(this.announcementToUpdate.announcementId,
      this.announcementToUpdate.title, this.announcementToUpdate.description, this.announcementToUpdate.announcementType).subscribe(
        response => {
          this.resultSuccess = true;
          this.resultError = false;
          this.message = "Announcement updated successfully";
          this.router.navigate(['/adminAnnouncementManagement']);
        },
        error => {
          this.resultError = true;
          this.resultSuccess = false;
          this.message = `An error has occurred while updating the announcement: ${error}`;

          console.log(`********** EditAnnouncementComponent.ts: ${error}`);
        }
      );

  }

}
