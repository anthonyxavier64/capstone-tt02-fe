import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  onManageCompanyDetailsClick() {
    this.router.navigateByUrl('/adminCompanyDetailsManagement');
  }

  onManageEmployeeClick() {
    this.router.navigateByUrl('/adminEmployeeManagement');
  }

  onManageWfoClick() {
    this.router.navigateByUrl('/adminWfoManagement');
  }

  onManageAnnouncementsClick() {
    this.router.navigateByUrl('/adminAnnouncementManagement');
  }
}
