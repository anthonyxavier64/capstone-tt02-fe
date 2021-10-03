import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GoalService } from 'src/app/services/goal/goal.service';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';
import { CreateNewTaskDialogComponent } from './../create-new-task-dialog/create-new-task-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  providers: [DialogService],
})
export class TaskComponent implements OnInit {
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
    private goalService: GoalService,
    private taskService: TaskService,
    private dialogService: DialogService,
    private userService: UserService,
    private location: Location
  ) {
    this.percentageProgress = 0;
    this.filterValue = '';
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.goalService.getAllGoalsByCompanyId(this.user.companyId).subscribe(
      (response) => {
        this.goals.push({ name: 'All Goals' });
        this.selectedGoal = this.goals[0];
        for (let goal of response.goals) {
          this.goals.push(goal);
        }

        for (let goal of this.goals) {
          this.taskService
            .getAllTasksByGoalId(goal.goalId, this.user.userId)
            .subscribe(
              (response) => {
                const goalTasks = response.tasks;
                for (let task of goalTasks) {
                  if (!task.isArchived) {
                    this.filteredTasks.push(task);
                  } else if (task.isArchived) {
                    this.archivedTasks.push(task);
                  }
                }
              },
              (error) => {}
            );
        }
      },
      (error) => {
        console.log(error);
      }
    );

    this.userService.getUsers(this.user.companyId).subscribe(
      (response) => {
        this.employees = response.users;
      },
      (error) => {}
    );
  }

  onBackClick(): void {
    this.location.back();
  }

  handleGoalSelection() {
    if (!!this.selectedGoal) {
      if (this.selectedGoal.name === 'All Goals') {
        this.tasks = [];
        this.filteredTasks = [];
        this.archivedTasks = [];
        this.employees = [];
        this.goals = [];
        this.ngOnInit();
      } else {
        this.taskService
          .getAllTasksByGoalId(this.selectedGoal.goalId, this.user.userId)
          .subscribe(
            (response) => {
              this.tasks = response.tasks;

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
            },
            (error) => {}
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
      },
      (error) => {
        console.log(error);
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
      },
      width: '85%',
      height: '70%',
      showHeader: false,
    });

    this.ref.onClose.subscribe((response) => {
      this.handleGoalSelection();
    });

    this.handleGoalSelection();
  }

  viewTaskArchives() {
    this.isViewArchivedClicked = !this.isViewArchivedClicked;
  }

  handleFilter() {
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

  openTaskDetails(task: any) {
    this.ref = this.dialogService.open(TaskDetailDialogComponent, {
      data: {
        goal: this.selectedGoal,
        task,
        employees: this.employees,
        isArchived: this.isViewArchivedClicked,
      },
      width: '80%',
      height: '70%',
      closable: false,
      showHeader: false,
    });

    this.ref.onClose.subscribe((task: any) => {
      if (task) {
        for (let i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].taskId === task.taskId) {
            this.tasks.splice(i, 1);
            break;
          }
        }
        this.handleGoalSelection();
      }
    });
  }
}
