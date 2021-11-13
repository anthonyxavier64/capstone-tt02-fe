import { MessageService } from 'primeng/api';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  providers: [MessageService],
})
export class FeedbackComponent implements OnInit {
  user: any | null;
  isLoading: boolean = true;

  constructor() { }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    this.isLoading = false;
  }

}
