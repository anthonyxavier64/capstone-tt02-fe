<<<<<<< HEAD
import { Component, OnInit, Inject } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Announcement } from 'src/app/models/announcement';
<<<<<<< HEAD
import { AnnouncementType } from '../../../models/announcement-type';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
=======
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)

@Component({
  selector: 'app-edit-announcement',
  templateUrl: './edit-announcement.component.html',
  styleUrls: ['./edit-announcement.component.css']
})
export class EditAnnouncementComponent implements OnInit {

  submitted: boolean;
<<<<<<< HEAD
  announcementId: number | undefined;
  titleToUpdate: string | undefined;
  date: Date | undefined;
  descriptionToUpdate: string | undefined;
  announcementToUpdate: Announcement;
  announcementType: string | undefined;
=======
  announcementId: string | null;
  announcementToUpdate: Announcement;
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)
  retrieveAnnouncementError: boolean;

  resultSuccess: boolean;
  resultError: boolean;
  message: string | undefined;

<<<<<<< HEAD

  constructor(public dialogRef: MatDialogRef<EditAnnouncementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private announcementService: AnnouncementService,
=======
  //public dialogRef: MatDialogRef<EditAnnouncementComponent>,
  //@Inject(MAT_DIALOG_DATA) public data: any
  constructor(private announcementService: AnnouncementService,
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.submitted = false;
    this.announcementToUpdate = new Announcement();

<<<<<<< HEAD
    this.announcementId = this.data.id;
    this.titleToUpdate = this.data.title;
    this.date = this.data.date;
    this.announcementType = this.data.typeOfAnnouncement;
    this.descriptionToUpdate = this.data.description;

=======
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)
    this.retrieveAnnouncementError = false;
    this.resultError = false;
    this.resultSuccess = false;
  }

  ngOnInit(): void {
<<<<<<< HEAD
    /*
=======
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)
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
<<<<<<< HEAD
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
=======
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)
  }

  update(updateAnnouncementForm: NgForm) {
    this.submitted = true;

    if (updateAnnouncementForm.invalid) {
      this.resultError = true;
      this.resultSuccess = false;
      return;
    }

<<<<<<< HEAD
    if (this.announcementType = 'COVID-19 Related') {
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
=======
    this.announcementService.updateAnnouncement(this.announcementToUpdate.announcementId, this.announcementToUpdate).subscribe(
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
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)

  }

}
