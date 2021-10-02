import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-create-new-task-dialog',
  templateUrl: './create-new-task-dialog.component.html',
  styleUrls: ['./create-new-task-dialog.component.css'],
  providers: [MessageService],
})
export class CreateNewTaskDialogComponent implements OnInit {
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
    private messageService: MessageService
  ) {
    this.goal = dialogConfig.data.goal;
    this.employees = dialogConfig.data.employees;
  }

  ngOnInit(): void {}

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
    const employeeIds = [];
    for (let assignedEmployee of this.assignedEmployees) {
      employeeIds.push(assignedEmployee.userId);
    }

    const newTaskDetails = {
      name: this.taskName,
      startDate: this.startDate,
      deadline: this.deadline,
      completionDate: undefined,
      remarks: this.remarks,
      isArchived: false,
      complexityLevel: this.complexity,
      employeeIds: employeeIds,
      teamIds: undefined,
      goalId: this.goal.goalId,
    };

    this.taskService.createTask(newTaskDetails).subscribe((response) => {
      this.ref.close();
    });
  }

  onClose(): void {
    this.ref.close();
  }
}
