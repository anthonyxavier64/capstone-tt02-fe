import { Component, OnInit } from '@angular/core';

import { CompanyService } from 'src/app/services/company/company.service';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-create-new-meeting',
  templateUrl: './create-new-meeting.component.html',
  styleUrls: ['./create-new-meeting.component.css'],
  providers: [MessageService],
})
export class CreateNewMeetingComponent implements OnInit {
  user: any | null;
  goal: any | null;
  company: any | null;
  rooms: any[];
  allGoals: any | null;
  employees: any[];
  scheduleType = ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'];
  assignedPhysicalEmployees: any[] = [];
  assignedVirtualEmployees: any[] = [];
  selectedPhysicalEmployees: any | null;
  selectedVirtualEmployees: any | null;
  selectedGoal: String; // Whats the diff between selectedGoal and chosenGoal?

  meetingTitle: string = '';
  remarks: string = '';
  meetingDate: Date = undefined;
  startTime: Date = undefined;
  endTime: Date = undefined;
  chosenScheduleType: any | null;
  chosenGoal: any;
  chosenRoom: any; // Should this be selectedRoom or chosenRoom?

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private companyService: CompanyService
  ) {
    this.selectedGoal = '';
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser);
    if (currentUser) {
      this.userService
        .getUser(JSON.parse(currentUser).userId)
        .subscribe((response) => {
          console.log(response.user);
          this.user = response.user;
          console.log(this.user);
        });
    }

    this.allGoals = []; //Fetch using Goal service later
    this.allGoals[0] = { name: 'No Goals' };
    this.allGoals[1] = { name: 'Test1' };
    this.allGoals[2] = { name: 'Test2' };

    this.goal = this.allGoals[0];

    console.log(currentUser);

    this.companyService.getCompany(JSON.parse(currentUser).companyId).subscribe(
      (response) => {
        console.log('Company Fetched: ' + JSON.stringify(response.company));
        this.company = response.company;
        this.rooms = this.company.rooms;
      },
      (error) => {}
    );

    this.userService.getUsers(JSON.parse(currentUser).companyId).subscribe(
      (response) => {
        console.log('allUsers Fetched: ' + response.users);
        this.employees = response.users;
        const userIndexToRemove = this.employees.findIndex(
          (item) => item.userId === this.user.userId
        );
        this.employees.splice(userIndexToRemove, 1);
      },
      (error) => {}
    );
  }

  // Does this use a form to implement responsiveness?
  assignPhysicalEmployee(employee: NgForm): void {
    const assignedEmployee = employee.value.selectedPhysicalEmployees;
    if (
      !this.assignedPhysicalEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      ) &&
      !this.assignedVirtualEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      )
    ) {
      this.assignedPhysicalEmployees.push(assignedEmployee);
      const indexToRemove = this.employees.findIndex(
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

  assignVirtualEmployee(employee: NgForm): void {
    const assignedEmployee = employee.value.selectedVirtualEmployees;
    if (
      !this.assignedPhysicalEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      ) &&
      !this.assignedVirtualEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      )
    ) {
      this.assignedVirtualEmployees.push(assignedEmployee);
      const indexToRemove = this.employees.findIndex(
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

  chooseMeetingRoom(room: NgForm): void {
    const assignedEmployee = room.value.selectedRoom;
    if (
      !this.assignedPhysicalEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      ) &&
      !this.assignedVirtualEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      )
    ) {
      this.assignedVirtualEmployees.push(assignedEmployee);
      const indexToRemove = this.employees.findIndex(
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

  unassignPhysicalEmployee(user: any): void {
    const indexToRemove = this.assignedPhysicalEmployees.findIndex(
      (item) => item.userId === user.userId
    );
    this.assignedPhysicalEmployees.splice(indexToRemove, 1);

    this.employees.push(user);
  }

  unassignVirtualEmployee(user: any): void {
    const indexToRemove = this.assignedVirtualEmployees.findIndex(
      (item) => item.userId === user.userId
    );
    this.assignedVirtualEmployees.splice(indexToRemove, 1);

    this.employees.push(user);
  }

  createNewMeeting(): void {
    // Following code is to pass in employee id instead of employee object
    // const employeeIds = [];
    // for (let assignedEmployee of this.assignedEmployees) {
    //   employeeIds.push(assignedEmployee.userId);
    // }
    // this.assignedEmployees.push(this.dialogConfig.data.user);
    // let goalToPassIn = this.chosenGoal
    //   ? this.chosenGoal.goalId
    //   : this.goal.goalId;
    // const newTaskDetails = {
    //   name: this.taskName,
    //   startDate: this.startDate,
    //   deadline: this.deadline,
    //   completionDate: undefined,
    //   remarks: this.remarks,
    //   isArchived: false,
    //   complexityLevel: this.complexity,
    //   employees: this.assignedEmployees,
    //   teamIds: undefined,
    //   goalId: goalToPassIn,
    //   userId: this.dialogConfig.data.user.userId,
    // };
    // this.taskService.createTask(newTaskDetails).subscribe((response) => {
    //   this.taskService
    //     .addUsersToTask(this.assignedEmployees, response.task.taskId)
    //     .subscribe((response) => {
    //       this.allGoals[0] = { name: 'All Tasks' };
    //       this.ref.close();
    //     });
    // });
  }
}
