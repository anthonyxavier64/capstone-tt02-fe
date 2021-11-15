import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-download-csv-dialog',
  templateUrl: './download-csv-dialog.component.html',
  styleUrls: ['./download-csv-dialog.component.css'],
})
export class DownloadCsvDialogComponent implements OnInit {
  company: any | undefined;
  templateDownloadUrl: string;

  constructor(
    public dialogRef: MatDialogRef<DownloadCsvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.company = this.data.company;
    this.templateDownloadUrl = this.data.downloadLink;
  }

  ngOnInit(): void {}

  downloadNewCsv(): void {
    window.open(this.templateDownloadUrl, '_self');
  }

  downloadExistingCsv(): void {
    window.open(this.company.employeeCsv, '_self');
  }
}
