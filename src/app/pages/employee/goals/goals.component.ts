import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GoalService } from 'src/app/services/goal/goal.service';
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
          };
          this.unarchivedGoals.push(goalWithProgress);
        }

        const filteredArchived = this.allGoals.filter(
          (item) => item.isArchived === true
        );
        for (let goal of filteredArchived) {
          const completedTasks = goal.assignedTasks.length();

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
        var goalToChangeIndex = this.unarchivedGoals.findIndex(
          (item) => item.goalId === response.goal.goalId
        );
        var updatedGoal = {
          ...goal,
          name: response.goal.name,
          startDate: response.goal.startDate,
        };
        this.unarchivedGoals[goalToChangeIndex] = updatedGoal;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Goal ${response.goal.goalId} successfully updated.`,
        });
      } else if (response.action === 'ERROR') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Goal ${response.goal.goalId} could not be updated.`,
        });
      }
    });
  }
}
