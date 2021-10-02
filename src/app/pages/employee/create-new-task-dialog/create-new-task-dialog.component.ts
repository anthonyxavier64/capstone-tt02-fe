import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-create-new-task-dialog',
  templateUrl: './create-new-task-dialog.component.html',
  styleUrls: ['./create-new-task-dialog.component.css'],
  providers: [MessageService],
})
export class CreateNewTaskDialogComponent implements OnInit {
  user: any | null;
  goal: any | null;
  employees: any[];
  assignedEmployees: any[] = [];
  selectedEmployee: any | null;

  taskName: string = '';
  remarks: string = '';
  startDate: Date = undefined;
  deadline: Date = undefined;
  complexity: Number = undefined;

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private taskService: TaskService,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.goal = this.dialogConfig.data.goal;
    this.user = this.dialogConfig.data.user;

    this.userService.getUsers(this.user.companyId).subscribe(
      (response) => {
        this.employees = response.users;
        const userIndexToRemove = this.employees.findIndex(
          (item) => item.userId === this.user.userId
        );
        this.employees.splice(userIndexToRemove, 1);
      },
      (error) => {}
    );
  }

  assignEmployee(employee: NgForm): void {
    const assignedEmployee = employee.value.selectedEmployee;
    if (
      !this.assignedEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      )
    ) {
      this.assignedEmployees.push(assignedEmployee);
      const indexToRemove = this.employees.find(
        (item) => item.userId === assignedEmployee.userId
      );
      this.employees.splice(indexToRemove, 1);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Employee already assigned',
      });
    }
  }

  unassignEmployee(user: any): void {
    const indexToRemove = this.assignedEmployees.find(
      (item) => item.userId === user.userId
    );
    this.assignedEmployees.splice(indexToRemove, 1);

    this.employees.push(user);
  }

  createNewTask(): void {
    // Following code is to pass in employee id instead of employee object
    // const employeeIds = [];
    // for (let assignedEmployee of this.assignedEmployees) {
    //   employeeIds.push(assignedEmployee.userId);
    // }
    this.assignedEmployees.push(this.dialogConfig.data.user);

    const newTaskDetails = {
      name: this.taskName,
      startDate: this.startDate,
      deadline: this.deadline,
      completionDate: undefined,
      remarks: this.remarks,
      isArchived: false,
      complexityLevel: this.complexity,
      employees: this.assignedEmployees,
      teamIds: undefined,
      goalId: this.goal.goalId,
      userId: this.dialogConfig.data.user.userId,
    };

    this.taskService.createTask(newTaskDetails).subscribe((response) => {
      this.taskService
        .addUsersToTask(this.assignedEmployees, response.task.taskId)
        .subscribe((response) => {
          this.ref.close();
        });
    });
  }

  onClose(): void {
    this.ref.close();
  }
}
