import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-home',
  templateUrl: './adminEmployeeManagement.component.html',
  styleUrls: ['./adminEmployeeManagement.component.css'],
})
export class AdminEmployeeManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }
}
