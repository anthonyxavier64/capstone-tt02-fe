import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GoalService } from 'src/app/services/goal/goal.service';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CreateNewTaskDialogComponent } from '../goals/create-new-task-dialog/create-new-task-dialog.component';
import { TaskDetailDialogComponent } from './task-detail-dialog/task-detail-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  providers: [DialogService, MessageService],
})
export class TaskComponent implements OnInit {
  isLoading: boolean = true;

  user: any;
  goals: any[] = [];
  selectedGoal: any;
  tasks: any[] = [];
  newTask: any;
  numCompleted: number;
  percentageProgress: number;
  filterValue: string;
  filteredTasks: any[] = [];
  archivedTasks: any[] = [];
  ref: DynamicDialogRef | undefined;
  employees: any[];
  isViewArchivedClicked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private goalService: GoalService,
    private taskService: TaskService,
    private dialogService: DialogService,
    private userService: UserService,
    private messageService: MessageService,
    private location: Location
  ) {
    this.percentageProgress = 0;
    this.filterValue = '';
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.populateGoalsAndTasks();
    this.isLoading = false;

    this.userService.getUsers(this.user.companyId).subscribe(
      (response) => {
        this.employees = response.users;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot retrieve users.',
        });
      }
    );
  }

  populateGoalsAndTasks(): void {
    this.goalService.getAllGoalsByCompanyId(this.user.companyId).subscribe(
      (response) => {
        this.tasks = [];
        this.filteredTasks = [];
        this.archivedTasks = [];
        this.goals = [];
        this.goals.push({ name: 'All Tasks' });
        const routeParam = this.route.snapshot.paramMap;
        const goalId = Number(routeParam.get('goalId'));

        for (let goal of response.goals) {
          this.goals.push(goal);
        }
        if (goalId === 0) {
          this.selectedGoal = this.goals[0];
          for (let goal of this.goals) {
            this.taskService
              .getAllTasksByGoalId(goal.goalId, this.user.userId)
              .subscribe(
                (response) => {
                  const goalTasks = response.tasks;
                  for (let task of goalTasks) {
                    const taskWithGoalName = { ...task, goalName: goal.name };
                    if (!task.isArchived) {
                      this.filteredTasks.push(taskWithGoalName);
                    } else if (task.isArchived) {
                      this.archivedTasks.push(taskWithGoalName);
                    }
                    console.log(this.filteredTasks);
                  }
                },
                (error) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Cannot retrieve tasks.',
                  });
                }
              );
          }
        } else {
          const goalToDisplay = response.goals.find(
            (item) => item.goalId === goalId
          );
          this.selectedGoal = goalToDisplay;
          this.handleGoalSelection();
        }
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot retrieve goals.',
        });
      }
    );
  }

  onBackClick(): void {
    this.location.back();
  }

  handleGoalSelection() {
    if (!!this.selectedGoal) {
      if (this.selectedGoal.name === 'All Tasks') {
        this.isLoading = true;
        this.populateGoalsAndTasks();
        this.isLoading = false;
      } else {
        this.isLoading = true;
        this.taskService
          .getAllTasksByGoalId(this.selectedGoal.goalId, this.user.userId)
          .subscribe(
            (response) => {
              this.tasks = [];
              this.filteredTasks = [];
              this.archivedTasks = [];
              var responseTasks = response.tasks;

              for (let task of responseTasks) {
                var taskWithGoalName = {
                  ...task,
                  goalName: this.selectedGoal.name,
                };
                this.tasks.push(taskWithGoalName);
              }
              const archivedTemp = this.tasks.filter((task) => {
                return task.isArchived === true;
              });

              this.archivedTasks = archivedTemp;

              const temp = this.tasks.filter((task) => {
                return task.isArchived === false;
              });

              this.filteredTasks = temp;

              this.numCompleted = 0;

              if (this.tasks.length > 0) {
                for (const task of this.tasks) {
                  if (!!task.completionDate) {
                    this.numCompleted++;
                  }
                }

                this.percentageProgress =
                  (this.numCompleted / this.tasks.length) * 100;
              } else {
                this.percentageProgress = 0;
              }

              this.isLoading = false;
            },
            (error) => {
              this.isLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Cannot retrieve tasks of selected goal.',
              });
            }
          );
      }
    }
  }

  handleChange(task: any) {
    if (!!task.completionDate) {
      task.completionDate = null;
      this.numCompleted--;
    } else {
      task.completionDate = new Date();
      this.numCompleted++;
    }

    this.taskService.updateTask(task).subscribe(
      (response) => {
        console.log(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task status updated!',
        });
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task. Please try again.',
        });
      }
    );

    this.percentageProgress = (this.numCompleted / this.tasks.length) * 100;
  }

  addTask() {
    this.newTask = {
      name: '',
      startDate: undefined,
      deadline: undefined,
      remarks: 'String',
      isArchived: false,
      complexityLevel: undefined,
    };
    this.ref = this.dialogService.open(CreateNewTaskDialogComponent, {
      data: {
        goal: this.selectedGoal,
        task: this.newTask,
        user: this.user,
        selectedGoal: this.selectedGoal,
        allGoals: this.goals,
      },
      width: '85%',
      height: 'auto',
      showHeader: false,
    });

    this.ref.onClose.subscribe((response) => {
      this.handleGoalSelection();
      if (response.action === 'USER_SUCCESS TASK_SUCCESS') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task added and users added to task successfully.',
        });
      } else if (response.action === 'USER_ERROR TASK_SUCCESS') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to add users to added task. Please try again.',
        });
      } else if (response.action === 'TASK_ERROR') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error adding task. Pease try again.',
        });
      }
    });

    this.handleGoalSelection();
  }

  viewTaskArchives() {
    this.isViewArchivedClicked = !this.isViewArchivedClicked;
  }

  handleFilter() {
    if (
      this.filterValue === '' ||
      this.filterValue === undefined ||
      this.filterValue === null
    ) {
      this.tasks = [];
      this.filteredTasks = [];
      this.archivedTasks = [];
      this.handleGoalSelection();
    } else {
      if (!this.isViewArchivedClicked) {
        this.filteredTasks = this.filteredTasks.filter((task) =>
          task.name.toLowerCase().includes(this.filterValue.toLowerCase())
        );
      } else if (this.isViewArchivedClicked) {
        this.archivedTasks = this.archivedTasks.filter((task) =>
          task.name.toLowerCase().includes(this.filterValue.toLowerCase())
        );
      }
    }
  }

  openTaskDetails(task: any) {
    const isSupervisor = this.user.userId === task.userId ? true : false;

    this.ref = this.dialogService.open(TaskDetailDialogComponent, {
      data: {
        goal: this.selectedGoal,
        allGoals: this.goals,
        task,
        employees: this.employees,
        isArchived: this.isViewArchivedClicked,
        isSupervisor,
      },
      width: '80%',
      height: 'auto',
      closable: false,
      showHeader: false,
    });

    this.ref.onClose.subscribe((response) => {
      if (response.task) {
        for (let i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].taskId === task.taskId) {
            this.tasks.splice(i, 1);
            break;
          }
        }
        this.handleGoalSelection();
        if (response.action === 'ARCHIVE_SUCCESS') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task archived successfully!',
          });
        } else if (response.action === 'UNARCHIVE_SUCCESS') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Task unarchived successfully! Task status is now marked as uncompleted.`,
          });
        }
      }
    });
  }

  hasInfectedPersonnel(task: any) {
    for (const employee of task.employees) {
      if (employee.isInfected) {
        return true;
      }
    }
    return false;
  }
}
