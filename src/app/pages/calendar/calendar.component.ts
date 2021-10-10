import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AdminGuideComponent } from 'src/app/pages/admin/adminLanding/admin-guide/admin-guide.component';
import { AuthService } from 'src/app/services/user/auth.service';

import { ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {

  user: any;
  company: any;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  setView(view: CalendarView) {
    this.view = view;
  }
}
