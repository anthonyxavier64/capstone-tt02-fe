import { Component, Inject, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoalService } from 'src/app/services/goal/goal.service';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-create-new-goal-dialog',
  templateUrl: './create-new-goal-dialog.component.html',
  styleUrls: ['./create-new-goal-dialog.component.css'],
})
export class CreateNewGoalDialogComponent implements OnInit {
  user: any;
  unassignedTasks: any[] = [];
  selectedUnassignedTasks: any[] = [];
  name: string;
  startDate: Date;

  constructor(
    public dialogRef: MatDialogRef<CreateNewGoalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private goalService: GoalService
  ) {}

  ngOnInit(): void {
    this.user = this.data.user;
    this.taskService.getAllTasksByGoalId(undefined, this.user.userId).subscribe(
      (response) => {
        this.unassignedTasks = response.tasks;
      },
      (error) => {}
    );
  }

  addTask(task: NgModel): void {
    const selectedTask = task.value;

    const indexToRemove = this.unassignedTasks.findIndex(
      (item) => item.taskId === selectedTask.taskId
    );
    this.unassignedTasks.splice(indexToRemove, 1);
    this.selectedUnassignedTasks.push(selectedTask);
    task.reset('Select Unassigned Task');
  }

  removeUnassignedTask(task: any): void {
    const indexToRemove = this.selectedUnassignedTasks.find(
      (item) => item.taskId === task.taskId
    );
    this.selectedUnassignedTasks.splice(indexToRemove, 1);
    this.unassignedTasks.push(indexToRemove);
    this.unassignedTasks.sort((a, b) => (a.taskId < b.taskId ? -1 : 1));
  }

  createGoal(): void {
    let selectedUnassignedTaskId = [];
    for (let task of this.selectedUnassignedTasks) {
      selectedUnassignedTaskId.push(task.taskId);
    }
    const goalToCreate = {
      name: this.name,
      companyId: this.user.companyId,
      isArchived: false,
      startDate: this.startDate,
      userInChargeId: this.user.userId,
      assignedTaskIds: selectedUnassignedTaskId,
    };
    this.goalService.createGoal(goalToCreate).subscribe(
      (response) => {
        let goal = response.goal;
        const goalToPassBack = {
          ...goal,
          assignedTasks: this.selectedUnassignedTasks,
        };
        this.dialogRef.close({ action: 'SUCCESS', goal: goalToPassBack });
      },
      (error) => {
        this.dialogRef.close({ action: 'ERROR' });
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close({ action: 'CLOSED' });
  }
}
