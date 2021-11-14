import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from 'src/app/services/user/user.service';
import { TaskService } from 'src/app/services/task/task.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-productivity-dialog',
  templateUrl: './view-productivity-dialog.component.html',
  styleUrls: ['./view-productivity-dialog.component.css'],
  providers: [MessageService],
})
export class ViewProductivityDialogComponent implements OnInit {

  user: any;
  fullName: string;
  contactNumber: number;
  id: string;
  productivity: any;
  email: string;
  numLeavesTaken: number;
  datesInOffice: any;
  numDaysInOffice: number;

  tasks: any[] = [];
  completedTasks: any[] = [];

  sumOfComplexities: number = 0;

  numDays: number = 0;
  numWeeks: number = 0;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private taskService: TaskService,
    private messageService: MessageService
  ) {
    console.log(config.data);
    this.id = config.data.userId;
    this.fullName = config.data.fullName;
    this.contactNumber = config.data.contactNumber;
    this.email = config.data.email;
    this.numLeavesTaken = config.data.numLeavesTaken;
    this.datesInOffice = config.data.datesInOffice;

    this.numDaysInOffice = this.datesInOffice.length;
  }

  ngOnInit(): void {
    this.taskService.getAllTasksByUser(this.id).subscribe(
      (result) => {
        this.tasks = result.tasks;

        for (let task of this.tasks) {
          if (task.completionDate !== null) {
            this.completedTasks.push(task);
          }
          console.log(this.completedTasks);
        }

        this.calculateProductivity();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Details could not be retrieved successfully',
        });
      }
    );
  }

  calculateProductivity() {
    //console.log(`Completed Tasks Length: ${this.completedTasks.length}`);

    if (this.completedTasks.length === 0) {
      this.productivity = 'Insufficient Data';
    }
    else {
      for (let task of this.completedTasks) {
        this.sumOfComplexities += task.complexityLevel;
      }
      //console.log(this.sumOfComplexities);

      let tasksByStartDate = this.completedTasks;
      tasksByStartDate = tasksByStartDate.sort((val1, val2) => val1.startDate - val2.startDate);
      // for (let t of tasksByStartDate) {
      //   console.log(`Completed Tasks by Start Date: ${t.startDate}`);
      // }

      const earliestStartDate = moment(tasksByStartDate[tasksByStartDate.length - 1].startDate.substring(0, 10));
      //console.log(earliestStartDate);

      let tasksByCompletionDate = this.completedTasks
      tasksByCompletionDate = tasksByCompletionDate.sort((val1, val2) => val2.completionDate - val1.completionDate);
      // for (let t2 of tasksByCompletionDate) {
      //   console.log(`Completed Tasks by Completion Date: ${t2.completionDate}`);
      // }

      const latestCompletionDate = moment(tasksByCompletionDate[0].completionDate.substring(0, 10));
      //console.log(latestCompletionDate);

      const oneDay = 1000 * 60 * 60 * 24;
      this.numDays = Math.round((latestCompletionDate.toDate().getTime() - earliestStartDate.toDate().getTime()) / oneDay);
      this.numWeeks = Math.round(this.numDays / 7);
      //console.log(this.numWeeks);

      if (this.numWeeks === 0) {
        this.productivity = 'Insufficient Data';
      }
      else {
        this.productivity = this.sumOfComplexities / this.numWeeks;
        //console.log(this.productivity);
      }

    }

  }

}
