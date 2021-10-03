import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
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
      (error) => {}
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
                  console.log(this.filteredTasks);
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

              this.isLoading = false;
            },
            (error) => {
              this.isLoading = false;
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
        selectedGoal: this.selectedGoal,
        allGoals: this.goals,
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
    this.ref = this.dialogService.open(TaskDetailDialogComponent, {
      data: {
        goal: this.selectedGoal,
        allGoals: this.goals,
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

  hasInfectedPersonnel(task: any) {
    for (const employee of task.employees) {
      if (employee.isInfected) {
        return true;
      }
    }
    return false;
  }
}
