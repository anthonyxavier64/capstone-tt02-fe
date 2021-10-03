import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskService } from 'src/app/services/task/task.service';

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

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private taskService: TaskService,
    private messageService: MessageService
  ) {
    this.task = this.dialogConfig.data.task;
    this.goal = this.dialogConfig.data.goal;
    this.allGoals = this.dialogConfig.data.allGoals;
    this.allGoals[0] = { name: 'No Goals' };
    this.isViewArchivedClicked = this.dialogConfig.data.isArchived;

    this.assignPopup = false;
    this.filterValue = '';
  }

  ngOnInit(): void {
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
            },
            (error) => {}
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
      },
      (error) => {}
    );
  }

  archive() {
    this.taskService.archiveTask(this.task.taskId).subscribe(
      (response) => {
        this.taskToPassBack = response.task;
      },
      (error) => {}
    );
  }

  unarchive(): void {
    this.taskService.unarchiveTask(this.task.taskId).subscribe(
      (response) => {
        this.taskToPassBack = response.task;
      },
      (error) => {}
    );
  }

  saveDetails(): void {
    if (
      this.updateDeadline &&
      this.updateTaskName &&
      this.updateStartDate &&
      this.updateGoal
    ) {
      const updatedTask = {
        ...this.task,
        name: this.updateTaskName,
        startDate: this.updateStartDate,
        deadline: this.updateDeadline,
        goalId: this.updateGoal.goalId,
      };
      this.taskService.updateTask(updatedTask).subscribe(
        (response) => {
          this.task = updatedTask;
          this.taskToPassBack = updatedTask;
          this.isEditMode = false;
        },
        (error) => {}
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Task could not be edited.',
      });
    }
  }
}
