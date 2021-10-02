import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GoalService } from 'src/app/services/goal/goal.service';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';
import { CreateNewTaskDialogComponent } from './../create-new-task-dialog/create-new-task-dialog.component';';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  providers: [DialogService],
})
export class TaskComponent implements OnInit {
  user: any;
  goals: any[];
  selectedGoal: any;
  tasks: any[];
  newTask: any;
  numCompleted: number;
  percentageProgress: number;
  filterValue: string;
  filteredTasks: any[];
  ref: DynamicDialogRef | undefined;
  employees: any[];

  constructor(
    private goalService: GoalService,
    private taskService: TaskService,
    private dialogService: DialogService,
    private userService: UserService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.percentageProgress = 0;
    this.filterValue = '';
  }

  ngOnInit(): void {
    this.goalService.getAllGoalsByCompanyId(this.user.companyId).subscribe(
      (response) => {
        this.goals = response.goals;
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

  handleGoalSelection() {
    if (!!this.selectedGoal) {
      console.log(this.selectedGoal.goalId);
      this.taskService
        .getAllTasksByGoalId(this.selectedGoal.goalId, this.user.userId)
        .subscribe(
          (response) => {
            this.tasks = response.tasks;
            this.filteredTasks = this.tasks;

            this.numCompleted = 0;

            console.log(this.tasks);

            for (const task of this.tasks) {
              if (!!task.completionDate) {
                this.numCompleted++;
              }
            }

            this.percentageProgress =
              (this.numCompleted / this.tasks.length) * 100;
          },
          (error) => {}
        );
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
        employees: this.employees,
      },
      width: '80%',
      height: '70%',
      showHeader: false,
    });

    this.ref.onClose.subscribe((response) => this.handleGoalSelection());
  }

  viewTaskArchives() {}

  handleFilter() {
    this.filteredTasks = this.tasks.filter((task) =>
      task.name.toLowerCase().includes(this.filterValue.toLowerCase())
    );
  }

  openTaskDetails(task: any) {
    this.ref = this.dialogService.open(TaskDetailDialogComponent, {
      data: {
        goal: this.selectedGoal,
        task,
        employees: this.employees,
      },
      width: '100%',
      height: '70%',
      closable: false,
      showHeader: false,
    });
  }
}
