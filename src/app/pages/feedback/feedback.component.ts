import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { UserService } from 'src/app/services/user/user.service';

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

  title: string | null;
  employees: any[] = [];
  selectedRecipient: any;
  message: string | null;

  feedbackSent: any = [];
  feedbackReceived: any = [];

  constructor(
    private userService: UserService,
    private feedbackService: FeedbackService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    this.isLoading = false;
    this.userService.getUsers(this.user.companyId).subscribe(
      (response) => {
        this.employees = response.users;
        const userIndexToRemove = this.employees.findIndex(
          (item) => item.userId === this.user.userId
        );
        this.employees.splice(userIndexToRemove, 1);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Unable to retrieve employees: ${error.message}`,
        });
      }
    );
    this.feedbackService.getFeedbackSent(this.user.userId).subscribe(
      (response) => {
        this.feedbackSent = response.feedbacks.sort((a, b) => {
          const dateA = moment(a.createdAt);
          const dateB = moment(b.createdAt);
          return dateB.diff(dateA);
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Unable to retrieve sent feedback: ${error.message}`,
        });
      }
    )
    this.feedbackService.getFeedbackReceived(this.user.userId).subscribe(
      (response) => {
        this.feedbackReceived = response.feedbacks.sort((a, b) => {
          const dateA = moment(a.createdAt);
          const dateB = moment(b.createdAt);
          return dateB.diff(dateA);
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Unable to retrieve received feedback: ${error.message}`,
        });
      }
    )
  }
  submitFeedback() {
    const feedback = {
      title: this.title,
      content: this.message.trim(),
      senderId: this.user.userId,
      recipientId: this.selectedRecipient.userId
    }
    this.feedbackService.createNewFeedback(feedback).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Feedback submitted.',
        });
        this.feedbackSent.unshift(response.feedback);
      },
      error => {
        console.log(this.message, this.title, this.selectedRecipient.userId);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occured: ${error.message}`,
        });
      })
  }

  inputIsValid() {
    return this.recipientIsValid() && this.messageIsValid() && this.titleIsValid();
  }
  titleIsValid() {
    const title = this.title?.trim();
    if (!this.title || !title || title === "") return false;
    return true;
  }
  messageIsValid() {
    const feedback = this.message?.trim();
    if (!this.message || !feedback || feedback === "" || this.message.length > 1000) return false;
    return true;
  }
  recipientIsValid() {
    if (this.selectedRecipient) return true;
    return false;
  }
}
