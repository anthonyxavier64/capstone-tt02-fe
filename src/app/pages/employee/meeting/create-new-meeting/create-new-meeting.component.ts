import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CompanyService } from 'src/app/services/company/company.service';
import { GoalService } from 'src/app/services/goal/goal.service';
import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { UserService } from 'src/app/services/user/user.service';
import { ColorSelectorDialogComponent } from './color-selector-dialog/color-selector-dialog.component';

moment.defineLocale('en-foo', {
  parentLocale: 'sg',
  /* */
});
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
  startTime: Date | string = undefined;
  meetingDuration: number = undefined;
  endTime: Date | string = undefined;
  chosenScheduleType: any | null;
  chosenGoal: any;
  chosenRoom: any; // Should this be selectedRoom or chosenRoom?

  currentCapacity: any;

  isLoading: boolean;
  isCompanyFetched: boolean;
  isUsersFetched: boolean;
  isUserFetched: boolean;

  blockoutDates: {
    userId: string;
    meetingId: number;
    date: Date;
    startTime: string;
    endTime: string;
  }[] = [];
  unassign: string = 'UNASSIGN';
  assign: string = 'ASSIGN';
  allInvolvedEmployees: string[] = [];
  datesToDisable: Date[] = [];

  startTimePlaceholder: string;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private userService: UserService,
    private companyService: CompanyService,
    private meetingService: MeetingService,
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
          this.allInvolvedEmployees.push(this.user.userId);
          this.meetingService
            .getAllMeetingsByParticipantId(this.user.userId)
            .subscribe(
              (response) => {
                var involvedMeetings = response.meetings;
                for (let meeting of involvedMeetings) {
                  var meetingStartTime = new Date(meeting.startTime);
                  var startTime = meetingStartTime.toLocaleTimeString();
                  var endTime = new Date(
                    meetingStartTime.getTime() + meeting.durationInMins * 60000
                  ).toLocaleTimeString();
                  var blockoutItem = {
                    userId: this.user.userId,
                    meetingId: meeting.meetingId,
                    date: meetingStartTime,
                    startTime: startTime,
                    endTime: endTime,
                  };

                  this.blockoutDates.push(blockoutItem);
                }
              },
              (error) => {}
            );
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
        disableClose: true,
        data: {
          colors: this.colors,
          chosenColor: this.chosenColor,
        },
      }
    );

    dialogRef.afterClosed().subscribe((response) => {
      this.chosenColor = response.data;
    });
  }

  async assignMeetingEmployee(employee: NgForm): Promise<void> {
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

    await this.generateNewRecommendation(this.assign);
  }

  // Does this use a form to implement responsiveness?
  async assignPhysicalEmployee(employee: NgForm): Promise<void> {
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

    await this.generateNewRecommendation(this.assign);
  }

  async assignVirtualEmployee(employee: NgForm): Promise<void> {
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

    await this.generateNewRecommendation(this.assign);
  }

  chooseMeetingRoom(room: any): void {
    this.chosenRoom = room;
    this.rooms.forEach((room) => {
      room.isSelected = false;
    });
    room.isSelected = true;
  }

  async unassignPhysicalEmployee(user: any): Promise<void> {
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

    await this.generateNewRecommendation(this.unassign, user.userId);
  }

  async unassignVirtualEmployee(user: any): Promise<void> {
    const indexToRemove = this.assignedVirtualEmployees.findIndex(
      (item) => item.userId === user.userId
    );
    this.assignedVirtualEmployees.splice(indexToRemove, 1);

    this.employees.push(user);

    await this.generateNewRecommendation(this.unassign, user.userId);
  }

  async unassignMeetingEmployee(user: any): Promise<void> {
    const indexToRemove = this.assignedMeetingEmployees.findIndex(
      (item) => item.userId === user.userId
    );
    this.assignedMeetingEmployees.splice(indexToRemove, 1);

    this.employees.push(user);

    await this.generateNewRecommendation(this.unassign, user.userId);
  }

  async generateNewRecommendation(
    methodType: string,
    employeeUnassignedId?: string
  ): Promise<void> {
    //LOGIC TO HANDLE ASSIGNING/UNASSIGNING EMPLOYEES INVOLVED FOR ALL 3 COLUMNS
    if (methodType === 'ASSIGN') {
      for (let employee of this.assignedMeetingEmployees) {
        if (!this.allInvolvedEmployees.includes(employee.userId)) {
          this.allInvolvedEmployees.push(employee.userId);
        }
      }

      for (let employee of this.assignedPhysicalEmployees) {
        if (!this.allInvolvedEmployees.includes(employee.userId)) {
          this.allInvolvedEmployees.push(employee.userId);
        }
      }

      for (let employee of this.assignedVirtualEmployees) {
        if (!this.allInvolvedEmployees.includes(employee.userId)) {
          this.allInvolvedEmployees.push(employee.userId);
        }
      }
    }

    if (
      methodType === 'UNASSIGN' &&
      this.allInvolvedEmployees.includes(employeeUnassignedId)
    ) {
      var indexToRemove = this.allInvolvedEmployees.findIndex(
        (item) => item === employeeUnassignedId
      );
      this.allInvolvedEmployees.splice(indexToRemove, 1);
    }

    //LOGIC TO FETCH ALL MEETING TIMES OF INVOLVED EMPLOYEES
    if (methodType === 'ASSIGN') {
      for (let employeeId of this.allInvolvedEmployees) {
        if (
          this.blockoutDates.find((item) => item.userId === employeeId) ===
          undefined
        ) {
          var findMeetings = await this.meetingService
            .getAllMeetingsByParticipantId(employeeId)
            .toPromise();

          var involvedMeetings = findMeetings.meetings;

          for (let meeting of involvedMeetings) {
            var meetingStartTime = new Date(meeting.startTime);

            var startTime = meetingStartTime.toLocaleTimeString();
            var endTime = new Date(
              meetingStartTime.getTime() + meeting.durationInMins * 60000
            ).toLocaleTimeString();
            var blockoutItem = {
              userId: employeeId,
              meetingId: meeting.meetingId,
              date: meetingStartTime,
              startTime: startTime,
              endTime: endTime,
            };

            this.blockoutDates.push(blockoutItem);
          }
        }
      }
    } else if (methodType === 'UNASSIGN') {
      if (
        this.blockoutDates.find((item) => item.userId === employeeUnassignedId)
      ) {
        this.blockoutDates = this.blockoutDates.filter(
          (item) => item.userId !== employeeUnassignedId
        );
      }
    }

    // SORT BLOCKOUT DATE BY MEETING START TIME
    this.blockoutDates.sort((a, b) => (a.startTime < b.startTime ? -1 : 1));

    // LOGIC TO UPDATE THE BLOCKED OUT DATES
    this.blockoutDates.forEach((item) => {
      var itemDate = new Date(item.date);

      if (
        this.datesToDisable.find(
          (item) => item.getDate() === itemDate.getDate()
        ) === undefined
      ) {
        this.datesToDisable.push(itemDate);
      }
    });
  }

  filter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.

    return (
      day !== 0 && day !== 6
      // && this.datesToDisable.find((item) => item.getDate() === d.getDate()) ===
      //   undefined
    );
  };

  convertDateToMoment(date: Date, time: string): moment.Moment {
    var dateSelected = date.toLocaleDateString();
    var format = dateSelected.split('/').join('-');
    var momentInput = format + ' ' + time;
    var momentOutput = moment(momentInput, 'DD-MM-YYYY hh:mm:ss');
    return momentOutput;
  }

  calculateEndTime(startTime: moment.Moment, duration: number): moment.Moment {
    var inputStartTimeString = startTime.toDate().toLocaleString();
    return moment(inputStartTimeString, 'DD-MM-YYYY hh:mm:ss').add(
      duration,
      'minutes'
    );
  }

  async generateTimeRecommendation(meetingDateInput: NgModel): Promise<void> {
    var generatedTimeFinalized: boolean = false;

    var selected: Date = meetingDateInput.value;
    var startTime = this.convertDateToMoment(
      selected,
      this.company.officeOpeningHour
    );
    var endTime = this.convertDateToMoment(
      selected,
      this.company.officeOpeningHour
    ).add(this.meetingDuration, 'minutes');

    var closingHour = this.convertDateToMoment(
      selected,
      this.company.officeClosingHour
    );

    var blockoutTimingsOnDate = await this.blockoutDates.filter((item) => {
      return item.date.toLocaleDateString() === selected.toLocaleDateString();
    });
    if (blockoutTimingsOnDate.length !== 0) {
      for (let i = 0; i < blockoutTimingsOnDate.length; i++) {
        if (!generatedTimeFinalized) {
          // Current item meeting start and end time
          var itemDate = blockoutTimingsOnDate[i].date;
          var itemStartTimeMoment = this.convertDateToMoment(
            itemDate,
            blockoutTimingsOnDate[i].startTime
          );
          var itemEndTimeMoment = this.convertDateToMoment(
            itemDate,
            blockoutTimingsOnDate[i].endTime
          );

          // If the iteration has reached the last meeting of the day
          if (i === blockoutTimingsOnDate.length - 1) {
            var newEndTime = this.calculateEndTime(
              startTime,
              this.meetingDuration
            );

            if (
              newEndTime.isBetween(itemStartTimeMoment, itemEndTimeMoment) ||
              newEndTime.isSameOrAfter(itemEndTimeMoment)
            ) {
              console.log('LAST INDEX AFTER FINAL MEETING');
              var newStartTime = itemEndTimeMoment;
              var finalEndTime = this.calculateEndTime(
                itemEndTimeMoment,
                this.meetingDuration
              );

              if (finalEndTime.isSameOrBefore(closingHour)) {
                startTime = newStartTime;
                generatedTimeFinalized = true;
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'No available timeslots for the day. Please select another day!',
                });
              }
            }
          } else {
            // Variables for next assumed start time after moving past the first
            var newStartTime = itemEndTimeMoment;

            var newEndTime = this.calculateEndTime(
              itemEndTimeMoment,
              this.meetingDuration
            );

            // Variables for next meeting on the list
            var nextItemStartTimeMoment = this.convertDateToMoment(
              blockoutTimingsOnDate[i + 1].date,
              blockoutTimingsOnDate[i + 1].startTime
            );
            var nextItemEndTimeMoment = this.convertDateToMoment(
              blockoutTimingsOnDate[i + 1].date,
              blockoutTimingsOnDate[i + 1].endTime
            );

            // If end time of meeting to be created clashes with the start of next meeting,
            // skip, otherwise, set the startTime of item to be created to be the endtime of the currentItem

            if (
              !newEndTime.isBetween(
                nextItemStartTimeMoment,
                nextItemEndTimeMoment
              )
            ) {
              console.log('IS NOT BETWEEN NEXT ITEM');

              if (newEndTime.isSameOrAfter(nextItemEndTimeMoment)) {
                console.log('EXCEED THE NEXT MEETING');
                var itemAfterNewEndTime = blockoutTimingsOnDate.find((item) => {
                  var itemToFindStartTimeMoment = this.convertDateToMoment(
                    item.date,
                    item.startTime
                  );
                  return itemToFindStartTimeMoment.isAfter(newEndTime);
                });
                if (itemAfterNewEndTime) {
                  console.log('AFTER EXCEEDED NEXT MEETING, ITEM FOUND');
                  var itemFoundStartTimeMoment = this.convertDateToMoment(
                    itemAfterNewEndTime.date,
                    itemAfterNewEndTime.startTime
                  );
                  startTime = itemFoundStartTimeMoment;
                }
              } else {
                console.log('NO MEETINGS OVERLAPPED');
                startTime = newStartTime;
                generatedTimeFinalized = true;
              }
            } else if (
              newEndTime.isBetween(
                nextItemStartTimeMoment,
                nextItemEndTimeMoment
              ) &&
              newEndTime !== nextItemEndTimeMoment
            ) {
              console.log('IS BETWEEN NEXT ITEM');
              startTime = nextItemEndTimeMoment;
            }
          }
        }
      }
    } else {
      if (!endTime.isSameOrBefore(closingHour)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'No available timeslots for the day. Please select another day!',
        });
      } else {
        generatedTimeFinalized = true;
      }
    }

    if (generatedTimeFinalized) {
      var updatedEndTimeToBind = this.calculateEndTime(
        startTime,
        this.meetingDuration
      );
      this.startTime = startTime.format().substring(11, 16);
      this.endTime = updatedEndTimeToBind.format().substring(11, 16);
    }
    console.log('FINAL', startTime.toDate().toLocaleTimeString());
  }

  timeInputChange(timeInput: NgModel) {
    var inputTimeMoment = this.convertDateToMoment(
      this.meetingDate,
      timeInput.value.concat(':00')
    );

    var outputTimeMoment = this.calculateEndTime(
      inputTimeMoment,
      this.meetingDuration
    );

    this.endTime = outputTimeMoment.format().substring(11, 16);
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
