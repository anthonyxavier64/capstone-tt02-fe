import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css'],
})
export class AccountActivationComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onClickLogIn() {
    this.router.navigate(['login']);
  }
}
