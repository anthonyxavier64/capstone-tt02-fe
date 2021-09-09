import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-home',
  templateUrl: './adminWfoManagement.component.html',
  styleUrls: ['./adminWfoManagement.component.css'],
})
export class AdminWfoManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  openOnMouseOver() {
    this.clickHoverMenuTrigger.openMenu();
  }
}
