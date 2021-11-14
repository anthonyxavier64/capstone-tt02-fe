import { MessageService } from 'primeng/api';
import { CommentService } from 'src/app/services/comment/comment.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-feedback',
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.css'],
  providers: [MessageService],
})
export class ViewFeedbackComponent implements OnInit {
  user: any;
  feedbackIsLoading: boolean = true;
  commentsIsLoading: boolean = true;
  feedback: any;
  newCommentMessage: string = "";
  comments: any[] = [];

  commentToEdit: any | null = null;
  updatedContent: string = "";

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private feedbackService: FeedbackService,
    private commentService: CommentService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    const routeParam = this.route.snapshot.paramMap;
    const feedbackId = routeParam.get('feedbackId');
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    this.feedbackService.getFeedbackByFeedbackId(feedbackId).subscribe(
      (response) => {
        this.feedback = response.feedback;
        this.feedbackIsLoading = false;
        //console.log(this.feedback)
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occured: ${error.message}`,
        });
      });
    this.commentService.getAllCommentsByFeedbackId(feedbackId).subscribe(
      (response) => {
        console.log(response.comments);
        this.comments = response.comments;
        this.commentsIsLoading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occured: ${error.message}`,
        });
      }
    )
  }
  submitComment() {
    this.commentService.createNewComment({
      content: this.newCommentMessage.trim(),
      feedbackId: this.feedback.feedbackId,
      senderId: this.user.userId
    })
      .subscribe(
        (response) => {
          this.comments.push(response.comment);
          this.newCommentMessage = "";
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Comment submitted.',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `An error has occured: ${error.message}`,
          });
        })
  }
  renderCommentSender(comment) {
    if (comment.sender.userId === this.user.userId) {
      return "Me";
    }
    return comment.sender.fullName;
  }
  renderCommentColor(comment) {
    if (comment.sender.userId === this.user.userId) {
      return "mine";
    }
    return "other";
  }
  isInEditMode(comment) {
    return (this.commentToEdit && this.commentToEdit.commentId === comment.commentId);
  }
  openEditMode(comment) {
    this.commentToEdit = comment;
    this.updatedContent = comment.content;
  }
  closeEditMode() {
    this.commentToEdit = null;
    this.updatedContent = "";
  }
  updatedCommentIsValid() {
    const comment = this.updatedContent?.trim();
    if (!this.updatedContent || !comment || comment === "" || this.updatedContent.length > 500) return false;
    return true;
  }
  updateComment() {
    let updatedComment = this.commentToEdit;
    updatedComment.content = this.updatedContent;
    this.commentService.updateComment(updatedComment).subscribe(
      (response) => {
        console.log(response);
        this.comments.map((item) => {
          if (item.commentId === this.commentToEdit.commentId) {
            let newComment = item;
            newComment.content = response.comment.content;
            return newComment;
          }
          return item;
        })
        this.closeEditMode();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Comment updated.',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occured: ${error.message}`,
        });
      })
  }

  commentIsValid() {
    const comment = this.newCommentMessage?.trim();
    if (!this.newCommentMessage || !comment || comment === "" || this.newCommentMessage.length > 500) return false;
    return true;
  }
  onBackClick() {
    this.location.back();
  }
  pageIsLoading() {
    return this.feedbackIsLoading && this.commentsIsLoading;
  }
}
