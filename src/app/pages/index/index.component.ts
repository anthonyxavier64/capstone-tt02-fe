import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit {
  email: string;
  password: string;

  constructor(private cdRef: ChangeDetectorRef, private auth: AuthService) {
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
        console.log(response);
      },
      error => {
        console.log(error);
      }
    )
  }

  handleLoginPopup() {
    
  }
}
