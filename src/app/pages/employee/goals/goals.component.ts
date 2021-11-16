import { MessageService } from 'primeng/api';
import { GoalService } from 'src/app/services/goal/goal.service';

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CreateNewGoalDialogComponent } from './create-new-goal-dialog/create-new-goal-dialog.component';
import { EditGoalDialogComponent } from './edit-goal-dialog/edit-goal-dialog.component';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
  providers: [MessageService],
})
export class GoalsComponent implements OnInit {
  user: any;
  allGoals: any[] = [];
  unarchivedGoals: any[] = [];
  archivedGoals: any[] = [];
  unassignedTasks: any[] = [];

  isViewArchivedClicked: boolean;
  isLoading: boolean;

  filterValue: string;

  constructor(
    private router: Router,
    private _location: Location,
    private messageService: MessageService,
    private goalService: GoalService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.goalService.getAllGoalsByCompanyId(this.user.companyId).subscribe(
      (response) => {
        this.allGoals = response.goals;
        const filteredUnarchived = this.allGoals.filter(
          (item) => item.isArchived === false
        );

        for (let goal of filteredUnarchived) {
          let completedTasks = 0;
          let uncompletedTasks = 0;
          goal.assignedTasks.forEach((item) => {
            if (item.completionDate === null) {
              uncompletedTasks++;
            } else {
              completedTasks++;
            }
          });
          var progress;
          if (uncompletedTasks === 0 && completedTasks === 0) {
            progress = 0;
          } else if (uncompletedTasks === 0) {
            progress = 100;
          } else {
            progress =
              (completedTasks / (completedTasks + uncompletedTasks)) * 100;
          }

          var goalWithProgress = {
            ...goal,
            goalProgress: progress,
            completedTasks: completedTasks,
            numberOfTasks: completedTasks + uncompletedTasks,
            completionDate: progress === 100 ? new Date() : null,
          };

          this.unarchivedGoals.push(goalWithProgress);
          const updateCompletionDate = {
            ...goal,
            completionDate: new Date(),
          };
          this.goalService.updateGoalById(updateCompletionDate).subscribe(
            (response) => {},
            (error) => {
              console.log(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to retrieve updated goal.',
              });
            }
          );
        }

        const filteredArchived = this.allGoals.filter(
          (item) => item.isArchived === true
        );
        for (let goal of filteredArchived) {
          let completedTasks = 0;
          let uncompletedTasks = 0;
          goal.assignedTasks.forEach((item) => {
            if (item.completionDate === null) {
              uncompletedTasks++;
            } else {
              completedTasks++;
            }
          });

          const goalWithProgress = {
            ...goal,
            goalProgress: 100,
            completedTasks: completedTasks,
            numberOfTasks: completedTasks,
          };
          this.archivedGoals.push(goalWithProgress);
        }

        this.isLoading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Company goals cannot be fetched. Please try again.',
        });
        this.isLoading = false;
      }
    );
  }

  onBackClick(): void {
    this._location.back();
  }

  goalToTaskNavigation(goalId: number): void {
    this.router.navigateByUrl(`task/${goalId}`);
  }

  handleFilter() {
    if (
      this.filterValue === '' ||
      this.filterValue === undefined ||
      this.filterValue === null
    ) {
      this.unarchivedGoals = this.allGoals.filter(
        (item) => item.isArchived === false
      );
      this.archivedGoals = this.allGoals.filter(
        (item) => item.isArchived === true
      );
    } else {
      if (!this.isViewArchivedClicked) {
        this.unarchivedGoals = this.unarchivedGoals.filter((item) =>
          item.name.toLowerCase().includes(this.filterValue.toLowerCase())
        );
      } else if (this.isViewArchivedClicked) {
        this.archivedGoals = this.archivedGoals.filter((item) =>
          item.name.toLowerCase().includes(this.filterValue.toLowerCase())
        );
      }
    }
  }

  viewGoalArchives(): void {
    this.isViewArchivedClicked = !this.isViewArchivedClicked;
  }

  hasInfectedPersonnel(goal: any) {
    for (let task of goal.assignedTasks) {
      for (let employee of task.employees) {
        if (employee.isInfected) {
          return true;
        }
      }
    }
    return false;
  }

  editGoal(goal: any) {
    let dialogRef = this.dialog.open(EditGoalDialogComponent, {
      data: {
        goal: goal,
      },
      panelClass: 'edit-goal-card',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response.action === 'SUCCESS') {
        if (!response.goal.isArchived) {
          var goalToChangeIndex = this.unarchivedGoals.findIndex(
            (item) => item.goalId === response.goal.goalId
          );
          this.unarchivedGoals[goalToChangeIndex].name = response.goal.name;
          this.unarchivedGoals[goalToChangeIndex].startDate =
            response.goal.startDate;
        } else {
          var goalToChangeIndex = this.archivedGoals.findIndex(
            (item) => item.goalId === response.goal.goalId
          );
          this.archivedGoals[goalToChangeIndex].name = response.goal.name;
          this.archivedGoals[goalToChangeIndex].startDate =
            response.goal.startDate;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Goal ${response.goal.goalId} successfully updated.`,
        });
      } else if (response.action === 'ERROR') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Goal could not be updated.`,
        });
      } else if (response.action === 'ARCHIVE') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Goal ${response.goal.goalId} has been successfully archived.`,
        });
        const indexToRemove = this.unarchivedGoals.findIndex(
          (item) => item.goalId === response.goal.goalId
        );

        const goalToPush = {
          ...this.unarchivedGoals[indexToRemove],
          isArchived: true,
        };

        this.archivedGoals.push(goalToPush);
        this.unarchivedGoals.splice(indexToRemove, 1);

        this.archivedGoals.sort((a, b) => (a.goalId < b.goalId ? -1 : 1));
      } else if (response.action === 'ARCHIVE_ERROR') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Goal could not be archived.`,
        });
      } else if (response.action === 'ARCHIVE_ERROR_INCOMPLETE') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Goal ${response.goal.goalId} could not be updated. Please complete all tasks within the goal first.`,
        });
      } else if (response.action === 'UNARCHIVE') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Goal ${response.goal.goalId} has been successfully unarchived.`,
        });
        const indexToRemove = this.archivedGoals.findIndex(
          (item) => item.goalId === response.goal.goalId
        );

        const goalToPush = {
          ...this.archivedGoals[indexToRemove],
          isArchived: false,
        };
        this.unarchivedGoals.push(goalToPush);
        this.archivedGoals.splice(indexToRemove, 1);
        this.unarchivedGoals.sort((a, b) => (a.goalId < b.goalId ? -1 : 1));
      }
    });
  }

  openAddGoalDialog(): void {
    let dialogRef = this.dialog.open(CreateNewGoalDialogComponent, {
      data: { user: this.user },
      panelClass: 'create-goal-card',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(
      (response) => {
        if (response.action === 'SUCCESS') {
          const goalTasks = response.goal.assignedTasks;
          let completedTasks = 0;
          let uncompletedTasks = 0;
          goalTasks.forEach((item) => {
            if (item.completionDate === null) {
              uncompletedTasks++;
            } else {
              completedTasks++;
            }
          });
          var progress;
          if (uncompletedTasks === 0 && completedTasks === 0) {
            progress = 0;
          } else if (uncompletedTasks === 0) {
            progress = 100;
          } else {
            progress =
              (completedTasks / (completedTasks + uncompletedTasks)) * 100;
          }
          let goal = {
            ...response.goal,
            goalProgress: progress,
            completedTasks: completedTasks,
            numberOfTasks: completedTasks + uncompletedTasks,
          };
          this.unarchivedGoals.push(goal);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Goal ${goal.goalId} has been created`,
          });
        } else if (response.action === 'ERROR') {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Goal could not be created.`,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Goal could not be created.`,
        });
      }
    );
  }
}
