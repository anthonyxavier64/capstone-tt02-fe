import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Announcement } from 'src/app/models/announcement';
import { AnnouncementType } from '../../../models/announcement-type';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-announcement',
  templateUrl: './edit-announcement.component.html',
  styleUrls: ['./edit-announcement.component.css']
})
export class EditAnnouncementComponent implements OnInit {

  submitted: boolean;
  announcementId: string | null;
  announcementToUpdate: Announcement;
  announcementType: String | undefined;
  retrieveAnnouncementError: boolean;

  resultSuccess: boolean;
  resultError: boolean;
  message: string | undefined;

  //public dialogRef: MatDialogRef<EditAnnouncementComponent>,
  //@Inject(MAT_DIALOG_DATA) public data: any
  constructor(private announcementService: AnnouncementService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.submitted = false;
    this.announcementToUpdate = new Announcement();

    this.retrieveAnnouncementError = false;
    this.resultError = false;
    this.resultSuccess = false;
  }

  ngOnInit(): void {
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
  }

  update(updateAnnouncementForm: NgForm) {
    this.submitted = true;

    if (updateAnnouncementForm.invalid) {
      this.resultError = true;
      this.resultSuccess = false;
      return;
    }

    if (this.announcementType = 'COVID-19 Related') {
      this.announcementToUpdate.announcementType = AnnouncementType.COVID_RELATED;
    }
    this.announcementToUpdate.announcementType = AnnouncementType.GENERAL;
    this.announcementToUpdate.date = new Date();

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

  }

}
