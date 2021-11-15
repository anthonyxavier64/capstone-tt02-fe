import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AdminGuideComponent } from './admin-guide/admin-guide.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  user: any | null;

  constructor(private router: Router, public dialog: MatDialog) {
    this.user = null;
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }

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

  openDialog(): void {
    let dialogRef = this.dialog.open(AdminGuideComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      // this.message = result;
    });
  }
}
