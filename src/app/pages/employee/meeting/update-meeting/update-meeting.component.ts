import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { ColorSelectorDialogComponent } from '../create-new-meeting/color-selector-dialog/color-selector-dialog.component';
import { CompanyService } from 'src/app/services/company/company.service';
import { DeleteMeetingDialogComponent } from '../delete-meeting-dialog/delete-meeting-dialog.component';
import { GoalService } from 'src/app/services/goal/goal.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MeetingService } from 'src/app/services/meeting/meeting.service';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user/user.service';

moment.defineLocale('en-foo', {
  parentLocale: 'sg',
  /* */
});
@Component({
  selector: 'app-update-meeting',
  templateUrl: './update-meeting.component.html',
  styleUrls: ['./update-meeting.component.css'],
  providers: [MessageService],
})
export class UpdateMeetingComponent implements OnInit {
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
  assignedRsvpPhysicalEmployees: any[] = [];
  assignedRsvpVirtualEmployees: any[] = [];
  selectedMeetingEmployees: any | null;
  selectedRsvpPhysicalEmployees: any | null;
  selectedRsvpVirtualEmployees: any | null;
  selectedGoal: String; // Whats the diff between selectedGoal and chosenGoal?
  meetingPhysicalAttendees: any[];
  meetingVirtualAttendees: any[];

  originalMeeting: any;

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

  invalidTime: boolean;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private userService: UserService,
    private companyService: CompanyService,
    private meetingService: MeetingService,
    private goalService: GoalService,
    private colorSelectorDialog: MatDialog,
    private deleteMeetingDialog: MatDialog,
    private activatedRoute: ActivatedRoute
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

    let meetingId = this.activatedRoute.snapshot.params.meetingId;
    if (meetingId) {
      this.meetingService.getMeetingByMeetingId(meetingId).subscribe(
        (response) => {
          this.originalMeeting = response.meeting;
          console.log(response.meeting);
          this.meetingTitle = this.originalMeeting.title;
          this.remarks = this.originalMeeting.remarks;
          this.meetingDate = new Date(this.originalMeeting.startTime);

          var startTimeMoment = moment(this.originalMeeting.startTime).format();
          this.startTime = startTimeMoment.substring(11, 16);
          this.meetingDuration = this.originalMeeting.durationInMins;
          let endTimeMoment = moment(startTimeMoment)
            .add(this.meetingDuration, 'minutes')
            .format();
          this.endTime = endTimeMoment.substring(11, 16);
          this.chosenGoal = this.originalMeeting.goal;
          this.chosenRoom = this.originalMeeting.room;
          this.chosenColor = this.originalMeeting.color;
          this.assignedRsvpPhysicalEmployees =
            this.originalMeeting.rsvpPhysicalEmployee;
          this.assignedRsvpVirtualEmployees =
            this.originalMeeting.rsvpVirtualEmployee;
          this.meetingPhysicalAttendees =
            this.originalMeeting.physicalAttendees;
          this.meetingVirtualAttendees = this.originalMeeting.virtualAttendees;
        },
        (error) => {}
      );
    }

    if (currentUser) {
      this.userService
        .getUser(JSON.parse(currentUser).userId)
        .subscribe((response) => {
          this.isLoading = true;
          this.user = response.user;
          this.allInvolvedEmployees.push(this.user.userId);
          this.meetingService
            .getAllMeetingsParticipant(this.user.userId)
            .subscribe(
              (response) => {
                var physicalMeetings = response.physicalMeetings;
                var virtualMeetings = response.virtualMeetings;
                var involvedMeetings = [];
                physicalMeetings.forEach((item) => involvedMeetings.push(item));
                virtualMeetings.forEach((item) => involvedMeetings.push(item));

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
                  for (let employee of this.assignedRsvpPhysicalEmployees) {
                    const userIndex = this.employees.findIndex(
                      (item) => item.userId === employee.userId
                    );
                    this.employees.splice(userIndex, 1);
                  }
                  for (let employee of this.assignedRsvpVirtualEmployees) {
                    const userIndex = this.employees.findIndex(
                      (item) => item.userId === employee.userId
                    );
                    this.employees.splice(userIndex, 1);
                  }
                  for (let employee of this.meetingPhysicalAttendees) {
                    const userIndex = this.employees.findIndex(
                      (item) => item.userId === employee.userId
                    );
                    this.employees.splice(userIndex, 1);
                  }
                  for (let employee of this.meetingVirtualAttendees) {
                    const userIndex = this.employees.findIndex(
                      (item) => item.userId === employee.userId
                    );
                    this.employees.splice(userIndex, 1);
                  }

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
        this.meetingService
          .getMeetingByMeetingId(meetingId)
          .subscribe((response) => {
            this.rooms.forEach((room) => {
              if (room.roomId != response.meeting.roomId) {
                room = { ...room, isSelected: false };
                console.log('Curr Room: ' + JSON.stringify(room));
              } else if (room.roomId == response.meeting.roomId) {
                room = { ...room, isSelected: true };
                console.log('Curr Room: ' + JSON.stringify(room));
              }
            });
            this.isCompanyFetched = true;
          });
        if (
          this.isUserFetched &&
          this.isCompanyFetched &&
          this.isUsersFetched
        ) {
          for (let employee of this.assignedRsvpPhysicalEmployees) {
            const userIndex = this.employees.findIndex(
              (item) => item.userId === employee.userId
            );
            this.employees.splice(userIndex, 1);
          }
          for (let employee of this.assignedRsvpVirtualEmployees) {
            const userIndex = this.employees.findIndex(
              (item) => item.userId === employee.userId
            );
            this.employees.splice(userIndex, 1);
          }
          for (let employee of this.meetingPhysicalAttendees) {
            const userIndex = this.employees.findIndex(
              (item) => item.userId === employee.userId
            );
            this.employees.splice(userIndex, 1);
          }
          for (let employee of this.meetingVirtualAttendees) {
            const userIndex = this.employees.findIndex(
              (item) => item.userId === employee.userId
            );
            this.employees.splice(userIndex, 1);
          }

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

  deleteMeeting(): void {
    var dialogRef = this.deleteMeetingDialog.open(
      DeleteMeetingDialogComponent,
      {
        width: '30%',
        height: '40%',
        data: { meetingId: this.originalMeeting.meetingId },
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
      !this.assignedRsvpPhysicalEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      ) &&
      !this.assignedRsvpVirtualEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      )
    ) {
      this.assignedRsvpPhysicalEmployees.push(assignedEmployee);
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
      !this.assignedRsvpPhysicalEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      ) &&
      !this.assignedRsvpVirtualEmployees.find(
        (item) => item.userId === assignedEmployee.userId
      )
    ) {
      this.assignedRsvpVirtualEmployees.push(assignedEmployee);
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
    const indexToRemove = this.assignedRsvpPhysicalEmployees.findIndex(
      (item) => item.userId === user.userId
    );
    this.assignedRsvpPhysicalEmployees.splice(indexToRemove, 1);

    if (user.userId !== this.user.userId) {
      this.employees.push(user);
    } else {
      this.assignedMeetingEmployees.push(user);
    }
    if (this.assignedRsvpPhysicalEmployees.length === 0) {
      this.rooms.forEach((room) => {
        room.isSelected = false;
      });
    }

    await this.generateNewRecommendation(this.unassign, user.userId);
  }

  async unassignVirtualEmployee(user: any): Promise<void> {
    const indexToRemove = this.assignedRsvpVirtualEmployees.findIndex(
      (item) => item.userId === user.userId
    );
    this.assignedRsvpVirtualEmployees.splice(indexToRemove, 1);

    if (user.userId !== this.user.userId) {
      this.employees.push(user);
    } else {
      this.assignedMeetingEmployees.push(user);
    }

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

  async unassignPhysicalAttendee(user: any): Promise<void> {
    const indexToRemove = this.meetingPhysicalAttendees.findIndex(
      (item) => item.userId === user.userId
    );
    this.meetingPhysicalAttendees.splice(indexToRemove, 1);

    if (user.userId !== this.user.userId) {
      this.employees.push(user);
    } else {
    }
    if (this.meetingPhysicalAttendees.length === 0) {
      this.rooms.forEach((room) => {
        room.isSelected = false;
      });
    }

    await this.generateNewRecommendation(this.unassign, user.userId);
  }

  async unassignVirtualAttendee(user: any): Promise<void> {
    const indexToRemove = this.meetingVirtualAttendees.findIndex(
      (item) => item.userId === user.userId
    );
    this.meetingVirtualAttendees.splice(indexToRemove, 1);

    if (user.userId !== this.user.userId) {
      this.employees.push(user);
    } else {
    }

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

      for (let employee of this.assignedRsvpPhysicalEmployees) {
        if (!this.allInvolvedEmployees.includes(employee.userId)) {
          this.allInvolvedEmployees.push(employee.userId);
        }
      }

      for (let employee of this.assignedRsvpVirtualEmployees) {
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
            .getAllMeetingsParticipant(employeeId)
            .toPromise();

          var physicalMeetings = findMeetings.physicalMeetings;
          var virtualMeetings = findMeetings.virtualMeetings;
          var involvedMeetings = [];
          physicalMeetings.forEach((item) => involvedMeetings.push(item));
          virtualMeetings.forEach((item) => involvedMeetings.push(item));
          console.log(involvedMeetings);

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

  async generateTimeRecommendation({
    meetingDate = undefined,
    nextEarliestStartTime = undefined,
    meetingDateInput = undefined,
  }): Promise<void> {
    this.rooms.forEach((item) => {
      item.isSelected = false;
      item['isAvailable'] = true;
      return item;
    });

    this.invalidTime = false;

    var generatedTimeFinalized: boolean = false;

    var selected: Date;

    if (meetingDateInput) {
      selected = meetingDateInput.value;
      this.meetingDate = selected;
    } else {
      selected = meetingDate;
    }

    var date = moment(selected).format('YYYY-MM-DD');

    if (!nextEarliestStartTime) {
      var startTime = this.convertDateToMoment(
        selected,
        this.company.officeOpeningHour
      );
    } else {
      var startTime = this.convertDateToMoment(selected, nextEarliestStartTime);
    }

    var endTime = this.convertDateToMoment(
      selected,
      this.company.officeOpeningHour
    ).add(this.meetingDuration, 'minutes');

    var officeOpeningHour = this.convertDateToMoment(
      selected,
      this.company.officeOpeningHour
    ).set('second', 0);

    var closingHour = this.convertDateToMoment(
      selected,
      this.company.officeClosingHour
    ).set('second', 0);

    var blockoutTimingsOnDate = await this.blockoutDates.filter((item) => {
      return item.date.toLocaleDateString() === selected.toLocaleDateString();
    });

    console.log(blockoutTimingsOnDate);
    var meetings = [];

    const response = await this.meetingService
      .getAllMeetingsByDate(this.company.companyId, date)
      .toPromise();

    if (response.meetings) {
      meetings = response.meetings;
    } else {
      // error
      console.log(response);
    }

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
            console.log('LAST ITEM');
            var newEndTime = this.calculateEndTime(
              startTime,
              this.meetingDuration
            );

            if (!startTime.isBetween(itemStartTimeMoment, itemEndTimeMoment)) {
              generatedTimeFinalized = true;
              this.checkMeetingRoomClashes(startTime, newEndTime, meetings);
            }

            if (
              newEndTime.isBetween(itemStartTimeMoment, itemEndTimeMoment) ||
              newEndTime.isSameOrAfter(itemEndTimeMoment)
            ) {
              var newStartTime = itemEndTimeMoment;
              var finalEndTime = this.calculateEndTime(
                itemEndTimeMoment,
                this.meetingDuration
              );

              if (finalEndTime.isSameOrBefore(closingHour)) {
                console.log('LAST ITEM BEFORE CLOSING HOURS');
                startTime = newStartTime;
                endTime = finalEndTime;

                this.checkMeetingRoomClashes(startTime, endTime, meetings);
                console.log('1');

                generatedTimeFinalized = true;
              } else {
                console.log('EXCEED CLOSING HOUR');

                startTime = newStartTime;
                endTime = finalEndTime;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'No available timeslots for the day. Please select another day!',
                });
                this.invalidTime = true;

                generatedTimeFinalized = true;
              }
            }
          } else {
            // Variables for next assumed start time after moving past the first
            console.log('NOT LAST ITEM');
            if (endTime.isBetween(itemStartTimeMoment, itemEndTimeMoment)) {
              var newStartTime = itemEndTimeMoment;
            } else {
              var newStartTime = startTime;
            }

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
              console.log('NOT IN BETWEEN NEXT ITEM');
              if (newEndTime.isSameOrAfter(nextItemEndTimeMoment)) {
                console.log('EXCEEDS NEXT ITEM');

                var isClashed: boolean = true;

                endTime = this.calculateEndTime(
                  startTime,
                  this.meetingDuration
                );

                while (isClashed) {
                  var itemClash = blockoutTimingsOnDate.find((item) => {
                    var itemToFindStartTimeMoment = this.convertDateToMoment(
                      item.date,
                      item.startTime
                    );
                    var itemToFindEndTimeMoment = this.convertDateToMoment(
                      item.date,
                      item.endTime
                    );

                    return (
                      startTime.isBetween(
                        itemToFindStartTimeMoment,
                        itemToFindEndTimeMoment,
                        undefined,
                        '[)'
                      ) ||
                      endTime.isBetween(
                        itemToFindStartTimeMoment,
                        itemToFindEndTimeMoment,
                        undefined,
                        '(]'
                      ) ||
                      itemToFindStartTimeMoment.isBetween(
                        startTime,
                        endTime,
                        undefined,
                        '[)'
                      ) ||
                      itemToFindEndTimeMoment.isBetween(
                        startTime,
                        endTime,
                        undefined,
                        '(]'
                      )
                    );
                  });

                  if (itemClash) {
                    var itemFoundEndTimeMoment = this.convertDateToMoment(
                      itemClash.date,
                      itemClash.endTime
                    );
                    startTime = itemFoundEndTimeMoment;
                    endTime = this.calculateEndTime(
                      startTime,
                      this.meetingDuration
                    );
                  } else {
                    isClashed = false;
                  }
                }

                endTime = this.calculateEndTime(
                  startTime,
                  this.meetingDuration
                );
                if (!endTime.isAfter(closingHour)) {
                  this.checkMeetingRoomClashes(startTime, endTime, meetings);
                  console.log('2');

                  if (
                    startTime.isAfter(closingHour) ||
                    endTime.isAfter(closingHour) ||
                    startTime.isBefore(officeOpeningHour) ||
                    endTime.isBefore(officeOpeningHour)
                  ) {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Meeting time cannot be out of working hours!',
                    });
                    this.invalidTime = true;
                  } else {
                    this.invalidTime = false;
                  }
                  generatedTimeFinalized = true;
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'No available timeslots for the day. Please select another day!',
                  });
                  this.invalidTime = true;
                  generatedTimeFinalized = true;
                }
              } else {
                console.log('NO OVERLAP');

                if (!startTime.isSameOrAfter(nextItemEndTimeMoment)) {
                  var finalEndTime = this.calculateEndTime(
                    newStartTime,
                    this.meetingDuration
                  );

                  startTime = newStartTime;
                  endTime = finalEndTime;
                } else {
                  console.log('MANUAL INPUT HANDLING');

                  endTime = this.calculateEndTime(
                    startTime,
                    this.meetingDuration
                  );

                  var isClashed: boolean = true;

                  while (isClashed) {
                    var itemClash = blockoutTimingsOnDate.find((item) => {
                      var itemToFindStartTimeMoment = this.convertDateToMoment(
                        item.date,
                        item.startTime
                      );
                      var itemToFindEndTimeMoment = this.convertDateToMoment(
                        item.date,
                        item.endTime
                      );

                      return (
                        startTime.isBetween(
                          itemToFindStartTimeMoment,
                          itemToFindEndTimeMoment,
                          undefined,
                          '[)'
                        ) ||
                        endTime.isBetween(
                          itemToFindStartTimeMoment,
                          itemToFindEndTimeMoment,
                          undefined,
                          '(]'
                        )
                      );
                    });
                    if (itemClash) {
                      var itemFoundEndTimeMoment = this.convertDateToMoment(
                        itemClash.date,
                        itemClash.endTime
                      );
                      startTime = itemFoundEndTimeMoment;
                      endTime = this.calculateEndTime(
                        startTime,
                        this.meetingDuration
                      );
                    } else {
                      isClashed = false;
                    }
                  }
                }
                endTime = this.calculateEndTime(
                  startTime,
                  this.meetingDuration
                );

                if (!endTime.isAfter(closingHour)) {
                  this.checkMeetingRoomClashes(startTime, endTime, meetings);
                  console.log('2');

                  generatedTimeFinalized = true;
                  this.invalidTime = false;
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'No available timeslots for the day. Please select another day!',
                  });
                  this.invalidTime = true;
                  generatedTimeFinalized = true;
                }
              }
            } else if (
              newEndTime &&
              newEndTime.isBetween(
                nextItemStartTimeMoment,
                nextItemEndTimeMoment
              ) &&
              newEndTime !== nextItemEndTimeMoment
            ) {
              console.log('SET NEXT ITEM');
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
        endTime = this.calculateEndTime(startTime, this.meetingDuration);
        this.invalidTime = true;
        generatedTimeFinalized = true;
      } else {
        console.log('3');

        this.checkMeetingRoomClashes(startTime, endTime, meetings);

        if (
          startTime.isAfter(closingHour) ||
          endTime.isAfter(closingHour) ||
          startTime.isBefore(officeOpeningHour) ||
          endTime.isBefore(officeOpeningHour)
        ) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Meeting time cannot be out of working hours!',
          });
          this.invalidTime = true;
        } else {
          this.invalidTime = false;
        }
        generatedTimeFinalized = true;

        // get meetings for the date
        // any meetings clashes with selected time (earliest recommended time) (start/end time is within time given)

        // if clashes, then check the rooms
        // if all rooms booked, move to next interval
        // check if next interval is in blockout times
        // if it is, then move to next interval
        // if not then repeat the process of checking against meetings
      }
    }

    if (generatedTimeFinalized) {
      console.log('StartTime:', startTime);
      var updatedEndTimeToBind = this.calculateEndTime(
        startTime,
        this.meetingDuration
      );
      console.log('Updated End Time:', updatedEndTimeToBind);
      // this.startTime = startTime.format().substring(11, 16);
      console.log('Generated Start Time: ', this.startTime);
      this.endTime = updatedEndTimeToBind.format();
      // .substring(11, 16);
      console.log('Generated End Time: ', this.endTime);

      if (
        updatedEndTimeToBind.isSameOrBefore(closingHour) &&
        startTime.isSameOrAfter(officeOpeningHour)
      ) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Earliest meeting time generated!',
        });
        this.invalidTime = false;
      } else {
        this.invalidTime = true;
      }
    }
  }

  dateInputChange(dateInput: NgModel) {
    this.meetingDate = dateInput.value;
  }

  timeInputChange(timeInput: NgModel) {
    var inputTimeMoment = this.convertDateToMoment(
      this.meetingDate,
      timeInput.value.concat(':00')
    );

    this.generateTimeRecommendation({
      meetingDate: this.meetingDate,
      nextEarliestStartTime: inputTimeMoment.toDate().toLocaleTimeString(),
    });

    var startTimeMoment = this.convertDateToMoment(
      this.meetingDate,
      this.startTime.toLocaleString()
    );

    var outputTimeMoment = this.calculateEndTime(
      startTimeMoment,
      this.meetingDuration
    );

    this.endTime = outputTimeMoment.format().substring(11, 16);
  }

  updateMeeting(): void {
    if (
      this.meetingTitle ||
      this.chosenColor ||
      this.assignedRsvpPhysicalEmployees ||
      this.assignedRsvpVirtualEmployees ||
      this.meetingDate ||
      this.meetingDuration ||
      this.startTime
    ) {
      var startDateTime = this.convertDateToMoment(
        this.meetingDate,
        this.startTime.toString()
      ).toDate();
      var assignedPhysicalEmployeeIds = [];
      var assignedVirtualEmployeeIds = [];
      this.assignedRsvpPhysicalEmployees.forEach((item) =>
        assignedPhysicalEmployeeIds.push(item.userId)
      );
      this.assignedRsvpVirtualEmployees.forEach((item) =>
        assignedVirtualEmployeeIds.push(item.userId)
      );

      console.log(this.chosenGoal);

      let meeting = {
        title: this.meetingTitle,
        color: this.chosenColor,
        remarks: this.remarks,
        durationInMins: this.meetingDuration,
        startTime: startDateTime,
        organiserId: this.user.userId,
        physicalRsvpIds: assignedPhysicalEmployeeIds,
        virtualRsvpIds: assignedVirtualEmployeeIds,
        roomId: this.chosenRoom ? this.chosenRoom.roomId : null,
        companyId: this.company.companyId,
        isVirtual: this.assignedRsvpVirtualEmployees.length > 0 ? true : false,
        isPhysical:
          this.assignedRsvpPhysicalEmployees.length > 0 ? true : false,
        goalId: this.chosenGoal ? this.chosenGoal.goalId : null,
      };

      this.meetingService.createNewMeeting(meeting).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Meeting successfully created!',
          });
          console.log(response);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Meeting could not be created. Please try again!',
          });
        }
      );
    }
  }

  async checkMeetingRoomClashes(startTime, endTime, meetings) {
    // checking room clashes
    startTime = startTime.set('second', 0);
    endTime = endTime.set('second', 0);

    let unavailableRoomCount = 0;
    let nextEarliestStartTime = startTime;

    if (meetings.length > 0) {
      const meetingDateTime = new Date(meetings[0].startTime);
      const meetingTime = meetingDateTime.toLocaleTimeString();

      const meetingStartTime = this.convertDateToMoment(
        meetingDateTime,
        meetingTime
      );

      let meetingEndTime = moment(meetingStartTime, 'DD-MM-YYYY hh:mm:ss').add(
        meetings[0].durationInMins,
        'minutes'
      );

      meetingEndTime = meetingEndTime.set('second', 0);

      nextEarliestStartTime = meetingEndTime;
    }

    for (const meeting of meetings) {
      //const inputStartTime = meeting.startTime.toLocaleDateString();

      const meetingDateTime = new Date(meeting.startTime);
      const meetingTime = meetingDateTime.toLocaleTimeString();

      const meetingStartTime = this.convertDateToMoment(
        meetingDateTime,
        meetingTime
      ).set('second', 0);

      const meetingEndTime = moment(meetingStartTime, 'DD-MM-YYYY hh:mm:ss')
        .add(meeting.durationInMins, 'minutes')
        .set('second', 0);

      if (
        meetingStartTime.isBetween(startTime, endTime, undefined, '[]') ||
        meetingEndTime.isBetween(startTime, endTime, undefined, '()')
      ) {
        const room = meeting.room;

        if (room) {
          for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].roomId === room.roomId) {
              this.rooms[i]['isAvailable'] = false;

              unavailableRoomCount++;

              if (meetingEndTime.isBefore(nextEarliestStartTime)) {
                nextEarliestStartTime = meetingEndTime;
              }
            }
          }
        }
      }
    }

    if (unavailableRoomCount === this.rooms.length) {
      // move to next time slot
      this.generateTimeRecommendation({
        meetingDate: this.meetingDate,
        nextEarliestStartTime: nextEarliestStartTime
          .toDate()
          .toLocaleTimeString(),
      });
    }
  }
}
