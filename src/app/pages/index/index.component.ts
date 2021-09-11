import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/user/auth.service';

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

  onSignUpClick() {
    this.router.navigateByUrl('/signUp');
  }

  handleLogin() {
    this.auth.login(this.email, this.password).then(
      (response) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.router.navigateByUrl('/admin');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleLoginPopup() {}
}
