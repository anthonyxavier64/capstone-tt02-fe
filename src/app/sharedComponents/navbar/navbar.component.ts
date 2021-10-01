import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AdminGuideComponent } from 'src/app/pages/admin/adminLanding/admin-guide/admin-guide.component';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void { }
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger;

  onCompanyLogoClick() {
    this.router.navigateByUrl('/admin');
  }

  onProfileLogoClick() {
    this.router.navigateByUrl('/profile');
  }

  onLogoutClick() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.auth.logout();
    this.router.navigateByUrl('/index');
    alert('Thank you for using Flexiwork, ' + currentUser.fullName + '!');
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(AdminGuideComponent, {
      width: '80%',
      height: '95%',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.message = result;
    });
  }

  onDashboardClick() {
    this.router.navigateByUrl('/dashboard');
  }
  
  handleGoals() {
    console.log('clicking on goals');
  }

  handleTasks() {
    this.router.navigateByUrl('/task');
  }
}
