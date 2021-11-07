import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-download-csv-dialog',
  templateUrl: './download-csv-dialog.component.html',
  styleUrls: ['./download-csv-dialog.component.css'],
})
export class DownloadCsvDialogComponent implements OnInit {
  company: any | undefined;
  templateDownloadUrl: string;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.company = this.config.data.company;
    this.templateDownloadUrl = this.config.data.downloadLink;
  }

  ngOnInit(): void {}

  downloadNewCsv(): void {
    window.open(this.templateDownloadUrl, '_self');
  }

  downloadExistingCsv(): void {
    window.open(this.company.employeeCsv, '_self');
  }
}
