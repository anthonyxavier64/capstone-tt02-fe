import * as moment from 'moment';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CovidDocumentSubmissionService } from 'src/app/services/covidDocumentSubmission/covidDocumentSubmission.service';

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ArtDialogComponent } from './art-test-results-dialog/art-test-dialog.component';
import { ShnDeclarationDialogComponent } from './shn-declaration-dialog/shn-declaration-dialog.component';
import { UploadVaccinationDialogComponent } from './upload-vaccination-dialog/upload-vaccination-dialog.component';

@Component({
  selector: 'app-covid-declarations',
  templateUrl: './covid-declarations.component.html',
  styleUrls: ['./covid-declarations.component.css'],
  providers: [DatePipe],
})
export class CovidDeclarationsComponent implements OnInit {
  user: any;
  covidDocumentSubmissions: any[];
  fetSubmissions: any[];
  mcs: any[];

  artTestDialogRef: DynamicDialogRef;
  shnDeclarationDialogRef: DynamicDialogRef;
  vaccinationDialogRef: DynamicDialogRef;
  covid: DynamicDialogRef;
  editDialogRef: DynamicDialogRef;
  deleteDialogRef: DynamicDialogRef;

  constructor(
    private router: Router,
    private covidDocumentSubmissionService: CovidDocumentSubmissionService,
    public dialogService: DialogService
  ) {
    this.covidDocumentSubmissions = [];
    this.fetSubmissions = [];
    this.mcs = [];
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
      this.covidDocumentSubmissionService
        .getUserSubmissions(this.user.userId)
        .subscribe(
          (response) => {
            this.covidDocumentSubmissions = response.covidDocumentSubmissions;
            this.fetSubmissions = this.covidDocumentSubmissions
              .filter(
                (item) =>
                  item.covidDocumentType === 'ART_TEST_RESULT' &&
                  item.documentApprovalStatus === 'APPROVED'
              )
              .sort((a, b) => {
                const dateA = moment(a.dateOfSubmission);
                const dateB = moment(b.dateOfSubmission);
                return dateB.diff(dateA);
              });
            this.mcs = this.covidDocumentSubmissions
              .filter(
                (item) =>
                  (item.covidDocumentType === 'SHN_MEDICAL_CERTIFICATE' ||
                    item.covidDocumentType === 'QUARANTINE_ORDER') &&
                  item.documentApprovalStatus === 'APPROVED'
              )
              .sort((a, b) => {
                const dateA = moment(a.dateOfSubmission);
                const dateB = moment(b.dateOfSubmission);
                return dateB.diff(dateA);
              });
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  vaccinationStatus() {
    if (this.user.isVaccinated) return 'green';
    return 'red';
  }
  fetApprovalStatus() {
    if (
      this.fetSubmissions[0]?.documentApprovalStatus.toUpperCase() ===
      'APPROVED'
    ) {
      if (this.fetSubmissions[0].isPositive) {
        return 'red';
      }
      return 'green';
    }

    return 'grey';
  }
  mcApprovalStatus() {
    if (this.mcs[0]?.documentApprovalStatus.toUpperCase() === 'APPROVED') {
      const today = moment();
      if (
        today.isAfter(this.mcs[0].startDate) &&
        today.isBefore(this.mcs[0].endDate)
      ) {
        return 'red';
      }
    }
    return 'green';
  }
  renderMcStatus() {
    if (this.mcs[0]?.documentApprovalStatus.toUpperCase() === 'APPROVED') {
      const today = moment();
      if (
        today.isAfter(this.mcs[0].startDate) &&
        today.isBefore(this.mcs[0].endDate)
      ) {
        if (this.mcs[0].covidDocumentType === 'SHN_MEDICAL_CERTIFICATE') {
          return 'On stay home notice';
        } else {
          return 'On quarantine order';
        }
      }
    }
    return 'Fit for work';
  }

  openArtTestDialog(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
  }) {
    this.artTestDialogRef = this.dialogService.open(ArtDialogComponent, {
      showHeader: false,
      width: '50%',
      contentStyle: { 'max-height': '50vw', overflow: 'auto', padding: '5%' },
      data: selectedUser,
    });

    this.artTestDialogRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }
  openShnDeclarationDialog(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
  }) {
    this.shnDeclarationDialogRef = this.dialogService.open(
      ShnDeclarationDialogComponent,
      {
        showHeader: false,
        width: '50%',
        contentStyle: { 'max-height': '50vw', overflow: 'auto', padding: '5%' },
        data: selectedUser,
      }
    );

    this.shnDeclarationDialogRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }
  openVaccinationDialog(selectedUser: {
    userId: number;
    fullName: string;
    email: string;
    createdAt: string;
    contactNumber: string;
    isActivated: boolean;
  }) {
    this.vaccinationDialogRef = this.dialogService.open(
      UploadVaccinationDialogComponent,
      {
        showHeader: false,
        width: '50%',
        contentStyle: { 'max-height': '50vw', overflow: 'auto', padding: '5%' },
        data: selectedUser,
      }
    );

    this.vaccinationDialogRef.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }
}
