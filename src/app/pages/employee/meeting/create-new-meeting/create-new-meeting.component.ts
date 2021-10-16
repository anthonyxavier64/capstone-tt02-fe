import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CompanyService } from 'src/app/services/company/company.service';
import { GoalService } from 'src/app/services/goal/goal.service';
import { UserService } from 'src/app/services/user/user.service';
import { ColorSelectorDialogComponent } from './color-selector-dialog/color-selector-dialog.component';

@Component({
  selector: 'app-create-new-meeting',
  templateUrl: './create-new-meeting.component.html',
  styleUrls: ['./create-new-meeting.component.css'],
  providers: [MessageService],
})
export class CreateNewMeetingComponent implements OnInit {
  user: any | null;
  goal: any | null;
  colors: string[];
  chosenColor: string;
  company: any | null;
  rooms: any[];
  allGoals: any | null;
  employees: any[];
  scheduleType = ['Daily', 'Weekly', 'Biweekly', 'Monthly'];
  selectedScheduleType: string;
  assignedMeetingEmployees: any[] = [];
  assignedPhysicalEmployees: any[] = [];
  assignedVirtualEmployees: any[] = [];
  selectedMeetingEmployees: any | null;
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

  currentCapacity: any;

  isLoading: boolean;
  isCompanyFetched: boolean;
  isUsersFetched: boolean;
  isUserFetched: boolean;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private userService: UserService,
    private companyService: CompanyService,
    private goalService: GoalService,
    private colorSelectorDialog: MatDialog
  ) {
    this.selectedGoal = '';
    this.colors = [
      'rgb(255, 166, 135)',
      'rgb(135, 224, 255)',
      'rgb(255, 226, 135)',
      'rgb(135, 164, 255)',
      'rgb(135, 255, 226)',
      'rgb(135, 255, 166)',
      'rgb(204, 191, 149)',
      'rgb(164, 149, 204)',
    ];
    this.chosenColor = 'rgb(255, 166, 135)';
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isCompanyFetched = false;
    this.isUserFetched = false;
    this.isUserFetched = false;
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.userService
        .getUser(JSON.parse(currentUser).userId)
        .subscribe((response) => {
          this.isLoading = true;
          this.user = response.user;
          this.isUserFetched = true;
          this.userService
            .getUsers(JSON.parse(currentUser).companyId)
            .subscribe(
              (response) => {
                this.isLoading = true;
                this.employees = response.users;
                const userIndexToRemove = this.employees.findIndex(
                  (item) => item.userId === this.user.userId
                );
                this.employees.splice(userIndexToRemove, 1);
                this.isUsersFetched = true;
                if (
                  this.isUserFetched &&
                  this.isCompanyFetched &&
                  this.isUsersFetched
                ) {
                  this.isLoading = false;
                }
              },
              (error) => {}
            );
        });
    }

    this.companyService.getCompany(JSON.parse(currentUser).companyId).subscribe(
      (response) => {
        this.isLoading = true;
        this.company = response.company;
        this.rooms = this.company.rooms;
        this.rooms.forEach((room) => {
          room = { ...room, isSelected: false };
        });
        this.isCompanyFetched = true;
        if (
          this.isUserFetched &&
          this.isCompanyFetched &&
          this.isUsersFetched
        ) {
          this.isLoading = false;
        }
      },
      (error) => {}
    );

    this.goalService
      .getAllGoalsByCompanyId(JSON.parse(currentUser).companyId)
      .subscribe(
        (response) => {
          this.allGoals = response.goals;
        },
        (error) => {}
      );
  }

  onBackClick() {
    this._location.back();
  }

  openColorSelector(): void {
    var dialogRef = this.colorSelectorDialog.open(
      ColorSelectorDialogComponent,
      {
        width: '30%',
        height: '40%',
        data: {
          colors: this.colors,
          chosen: this.chosenColor,
        },
      }
    );

    dialogRef.afterClosed().subscribe((response) => {
      this.chosenColor = response.data;
    });
  }

  assignMeetingEmployee(employee: NgForm): void {
    const assignedEmployee = employee.value.selectedMeetingEmployees;
    if (
      !this.assignedMeetingEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      )
    ) {
      this.assignedMeetingEmployees.push(assignedEmployee);
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

    employee.resetForm();
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
      const indexToRemove = this.assignedMeetingEmployees.findIndex(
        (item) => item.userId === assignedEmployee.userId
      );
      this.assignedMeetingEmployees.splice(indexToRemove, 1);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Employee already assigned',
      });
    }
    employee.resetForm();
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
      const indexToRemove = this.assignedMeetingEmployees.findIndex(
        (item) => item.userId === assignedEmployee.userId
      );
      this.assignedMeetingEmployees.splice(indexToRemove, 1);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Employee already assigned',
      });
    }

    employee.resetForm();
  }

  chooseMeetingRoom(room: any): void {
    this.chosenRoom = room;
    this.rooms.forEach((room) => {
      room.isSelected = false;
    });
    room.isSelected = true;
  }

  unassignPhysicalEmployee(user: any): void {
    const indexToRemove = this.assignedPhysicalEmployees.findIndex(
      (item) => item.userId === user.userId
    );
    this.assignedPhysicalEmployees.splice(indexToRemove, 1);

    this.employees.push(user);
    if (this.assignedPhysicalEmployees.length === 0) {
      this.rooms.forEach((room) => {
        room.isSelected = false;
      });
    }
  }

  unassignVirtualEmployee(user: any): void {
    const indexToRemove = this.assignedVirtualEmployees.findIndex(
      (item) => item.userId === user.userId
    );
    this.assignedVirtualEmployees.splice(indexToRemove, 1);

    this.employees.push(user);
  }

  unassignMeetingEmployee(user: any): void {
    const indexToRemove = this.assignedMeetingEmployees.findIndex(
      (item) => item.userId === user.userId
    );
    this.assignedMeetingEmployees.splice(indexToRemove, 1);

    this.employees.push(user);
  }

  createNewMeeting(): void {
    this.selectedScheduleType = this.selectedScheduleType.toUpperCase();

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
