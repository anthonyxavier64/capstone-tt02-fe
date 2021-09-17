import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-companyDetailsManagement',
  templateUrl: './adminCompanyDetailsManagement.component.html',
  styleUrls: ['./adminCompanyDetailsManagement.component.css'],
})
export class AdminCompanyDetailsManagementComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }

  handleBackButton() {
    this.router.navigateByUrl('/admin');
  }
}
