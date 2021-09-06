import { AuthService } from 'src/app/services/user/auth.service';

import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit {
  email: string;
  password: string;

  constructor(private cdRef: ChangeDetectorRef, private auth: AuthService, private router: Router) {
    this.email = '';
    this.password = '';
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  handleLogin() {
    this.auth.login(this.email, this.password).then(
      response => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.router.navigateByUrl('/home');
      },
      error => {
        console.log(error);
      }
    )
  }

  handleLoginPopup() {
    
  }
}
