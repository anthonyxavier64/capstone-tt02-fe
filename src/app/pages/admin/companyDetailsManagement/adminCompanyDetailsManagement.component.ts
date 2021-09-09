import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-admin-companyDetailsManagement',
  templateUrl: './adminCompanyDetailsManagement.component.html',
  styleUrls: ['./adminCompanyDetailsManagement.component.css'],
})
export class AdminCompanyDetailsManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }
}
