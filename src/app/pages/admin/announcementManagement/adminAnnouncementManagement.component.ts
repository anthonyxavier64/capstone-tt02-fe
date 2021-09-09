import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-admin-announcementManagement',
  templateUrl: './adminAnnouncementManagement.component.html',
  styleUrls: ['./adminAnnouncementManagement.component.css'],
})
export class AdminAnnouncementManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }
}
