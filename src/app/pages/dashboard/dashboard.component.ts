import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any | null;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }

}
