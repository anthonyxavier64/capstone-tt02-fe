import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeleteCommentComponent } from 'src/app/pages/feedback/delete-comment/delete-comment.component';
import { CommentService } from 'src/app/services/comment/comment.service';
import { TaskService } from 'src/app/services/task/task.service';

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
  styleUrls: ['./task-detail-dialog.component.css'],
  providers: [MessageService],
})
export class TaskDetailDialogComponent implements OnInit {
  task: any;
  goal: any;
  allGoals: any;
  assignPopup: boolean;
  filterValue: string;
  personnel: any[];
  unassignedPersonnel: any[];
  selectedEmployees: any[] = [];
  taskToPassBack: any;
  supervisor: any;
  isViewArchivedClicked: boolean;
  isEditMode: boolean = false;

  updateTaskName: string;
  updateStartDate: Date;
  updateDeadline: Date;
  updateGoal: any;
  isSupervisor: boolean;

  comments: any[] = [];
  newCommentMessage: string = "";
  user: any;
  commentToEdit: any = null;
  updatedContent: string = "";

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private taskService: TaskService,
    private messageService: MessageService,
    private commentService: CommentService,
    private matDialog: MatDialog
  ) {
    this.task = this.dialogConfig.data.task;
    this.task = {
      ...this.task,
      startDate: this.task.startDate.substring(0, 10),
      deadline: this.task.deadline.substring(0, 10),
      employees: this.task.employees,
    };
    this.goal = this.dialogConfig.data.goal;
    this.allGoals = this.dialogConfig.data.allGoals;
    this.allGoals[0] = { name: 'No Goals' };
    this.isViewArchivedClicked = this.dialogConfig.data.isArchived;
    this.isSupervisor = this.dialogConfig.data.isSupervisor;

    this.updateTaskName = this.task.name;
    this.updateStartDate = this.task.startDate;
    this.updateDeadline = this.task.deadline;
    this.updateGoal = this.task?.goalId
      ? this.allGoals.find((item) => item.goalId === this.task.goalId)
      : null;

    this.assignPopup = false;
    this.filterValue = '';
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    this.commentService.getAllCommentsByFeedbackId(this.task.taskId).subscribe(
      (response) => {
        this.comments = response.comments;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occured: ${error.message}`,
        });
      }
    )
    const employees = this.dialogConfig.data.employees;
    this.personnel = this.task.employees.filter(
      (emp) => emp.userId !== this.task.supervisor.userId
    );
    this.unassignedPersonnel = employees.filter((emp) => {
      if (emp.userId === this.task.supervisor.userId) {
        return false;
      }
      for (const person of this.personnel) {
        if (person.userId === emp.userId) {
          return false;
        }
      }
      return true;
    });
  }

  closeDialog() {
    this.dialogConfig.data.allGoals[0] = { name: 'All Tasks' };
    this.ref.close(this.taskToPassBack);
  }

  toggleAssignMore() {
    this.assignPopup = !this.assignPopup;

    if (this.assignPopup === false) {
      // add employee

      if (this.selectedEmployees.length > 0) {
        for (let employee of this.selectedEmployees) {
          const indexToRemove = this.unassignedPersonnel.findIndex(
            (item) => employee.userId === item.userId
          );

          this.unassignedPersonnel.splice(indexToRemove, 1);

          this.personnel = [...this.personnel, employee];
          this.unassignedPersonnel = [...this.unassignedPersonnel];
        }

        this.taskService
          .addUsersToTask(this.selectedEmployees, this.task.taskId)
          .subscribe(
            (response) => {
              this.taskToPassBack = response.task;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Task assigned.',
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `An error has occured: ${error.message}`,
              });
            }
          );

        this.selectedEmployees = [];
      }
    }
  }

  deleteUser(userId: string) {
    this.taskService.deleteUserFromTask(userId, this.task.taskId).subscribe(
      (response) => {
        let employee;
        for (let i = 0; i < this.personnel.length; i++) {
          if (this.personnel[i].userId === userId) {
            employee = this.personnel[i];
            this.personnel.splice(i, 1);
            break;
          }
        }
        this.unassignedPersonnel = [...this.unassignedPersonnel, employee];
        this.taskToPassBack = response.task;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User removed.',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occured: ${error.message}`,
        });
      }
    );
  }

  archive() {
    if (this.task.completionDate !== null) {
      this.taskService.archiveTask(this.task.taskId).subscribe(
        (response) => {
          this.taskToPassBack = response.task;
          this.ref.close(this.taskToPassBack);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task archived.',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `An error has occured: ${error.message}`,
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please complete the task before archiving it.',
      });
    }
  }

  unarchive(): void {
    this.taskService.unarchiveTask(this.task.taskId).subscribe(
      (response) => {
        this.taskToPassBack = response.task;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task unarchived.',
        });
        this.ref.close(this.taskToPassBack);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occured: ${error.message}`,
        });
      }
    );
    this.task.completionDate = null;
    const updatedTask = {
      ...this.task,
      completionDate: this.task.completionDate,
    };
    this.taskService.updateTask(updatedTask).subscribe(
      (response) => {
        this.task = updatedTask;
        this.taskToPassBack = updatedTask;
        this.isEditMode = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task updated.',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occured: ${error.message}`,
        });
      }
    );
  }

  saveDetails(): void {
    const startDate = moment(this.task.startDate);
    const deadline = moment(this.task.deadline);

    if (!startDate.isAfter(deadline)) {
      const updatedTask = {
        ...this.task,
        name: this.updateTaskName,
        startDate: this.updateStartDate,
        deadline: this.updateDeadline,
        completionDate: this.task.completionDate,
        goalId: this.updateGoal ? this.updateGoal.goalId : null,
        newGoalId: this.updateGoal ? this.updateGoal.goalId : null,
        previousGoalId: this.task.goalId,
      };
      this.taskService.updateTask(updatedTask).subscribe(
        (response) => {
          this.task = updatedTask;
          this.taskToPassBack = updatedTask;
          this.isEditMode = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task updated.',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `An error has occured: ${error.message}`,
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Task could not be edited. Start date cannot be after deadline.',
      });
    }
  }

  toggleEditDetails(): void {
    this.updateTaskName = this.task.name;
    this.updateStartDate = this.task.startDate;
    this.updateDeadline = this.task.deadline;
    this.updateGoal = this.task?.goalId
      ? this.allGoals.find((item) => item.goalId === this.task.goalId)
      : null;
    this.isEditMode = !this.isEditMode;
  }

  submitComment() {
    this.commentService.createNewComment({
      content: this.newCommentMessage.trim(),
      taskId: this.task.taskId,
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
  isInEditCommentMode(comment) {
    return (this.commentToEdit && this.commentToEdit.commentId === comment.commentId);
  }
  openDeleteCommentDialog(comment) {
    const confirmDialog = this.matDialog.open(DeleteCommentComponent, {
      data: {
        title: 'Delete Comment',
      },
      disableClose: true,
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === false) {
        return;
      }
      this.commentService.deleteComment(comment.commentId).subscribe(
        () => {
          this.comments = this.comments.filter((item) => {
            return item.commentId !== comment.commentId;
          })
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Comment deleted.',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `An error has occured: ${error.message}`,
          });
        })
    });
  }
  openEditCommentMode(comment) {
    this.commentToEdit = comment;
    this.updatedContent = comment.content;
  }
  closeEditCommentMode() {
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
        this.comments.map((item) => {
          if (item.commentId === this.commentToEdit.commentId) {
            let newComment = item;
            newComment.content = response.comment.content;
            return newComment;
          }
          return item;
        })
        this.closeEditCommentMode();
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
}
