import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { AuthService } from 'src/app/services/user/auth.service';
import { Department } from 'src/app/models/department.model';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit, AfterViewInit {
  email: string;
  password: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private auth: AuthService,
    private router: Router
  ) {
    this.email = '';
    this.password = '';
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }
  onSignInClick() {
    this.router.navigateByUrl('/login');
  }

  handleLoginPopup() {}
  onSignUpClick() {
    this.router.navigateByUrl('/signUp');
  }

  handleLogin() {}
}
