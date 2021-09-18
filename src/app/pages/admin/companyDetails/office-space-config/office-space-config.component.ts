import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-office-space-config',
  templateUrl: './office-space-config.component.html',
  styleUrls: ['./office-space-config.component.css'],
})
export class OfficeSpaceConfigComponent implements OnInit {
  rooms: { roomNumber: string; roomLocation: string; roomCapacity: number }[];

  officeName: string;
  officeAddress: string;
  officeOpeningHours: string;
  officeCapacity: number;

  editRoomIndex: number; //used to search up the item within the array of rooms

  isEditOfficeDetailsOpen: boolean = false;
  isEditRoomDetailsOpen: boolean = false;
  isAddRoomOpen: boolean = false;

  constructor(private _location: Location) {}

  ngOnInit(): void {
    //Office Mock Data
    var officeName = localStorage.getItem('officeName');
    if (officeName !== null) {
      this.officeName = officeName;
    } else {
      this.officeName = 'Company Name';
    }

    var officeAddress = localStorage.getItem('officeAddress');
    if (officeAddress !== null) {
      this.officeAddress = officeAddress;
    } else {
      this.officeAddress = 'Singapore Street Blk Singapore #SG-SG';
    }

    var officeOpeningHours = localStorage.getItem('officeOpeningHours');
    if (officeOpeningHours !== null) {
      this.officeOpeningHours = officeOpeningHours;
    } else {
      this.officeOpeningHours = '08:00 - 17:00';
    }

    this.officeCapacity = 64;

    //Rooms Mock Data
    var cachedRooms = localStorage.getItem('rooms');
    if (cachedRooms !== null) {
      this.rooms = JSON.parse(cachedRooms);
    } else {
      this.rooms = [
        {
          roomNumber: '01-01',
          roomLocation: '1st Floor',
          roomCapacity: 8,
        },
        {
          roomNumber: '01-02',
          roomLocation: '1st Floor',
          roomCapacity: 6,
        },
        {
          roomNumber: '01-03',
          roomLocation: '1st Floor',
          roomCapacity: 10,
        },
        {
          roomNumber: '02-01',
          roomLocation: '2nd Floor',
          roomCapacity: 8,
        },
        {
          roomNumber: '02-02',
          roomLocation: '2nd Floor',
          roomCapacity: 9,
        },
      ];
    }
  }

  onBackClick() {
    this._location.back();
  }

  openEditOfficeDetailsDialog() {
    this.isEditOfficeDetailsOpen = true;
  }

  openEditRoomDetailsDialog(roomItem: {}) {
    this.isEditRoomDetailsOpen = true;
    this.editRoomIndex = this.rooms.findIndex((room) => room === roomItem);
  }

  deleteRoom() {
    if (this.editRoomIndex > -1) {
      this.rooms.splice(this.editRoomIndex, 1);
      this.rooms.sort((a, b) => {
        if (
          Number(a.roomLocation.substring(0, 1)) >
          Number(b.roomLocation.substring(0, 1))
        ) {
          return 1;
        } else if (
          Number(a.roomLocation.substring(0, 1)) <
          Number(b.roomLocation.substring(0, 1))
        ) {
          return -1;
        } else {
          return 0;
        }
      });
      localStorage.setItem('rooms', JSON.stringify(this.rooms));
      this.isEditRoomDetailsOpen = false;
      this.ngOnInit();
    } else {
      alert('The selected room cannot be deleted!');
    }
  }

  openAddRoomDialog() {
    this.isAddRoomOpen = true;
  }

  submitOfficeDetailsForm(officeDetailsForm: NgForm) {
    var officeName = officeDetailsForm.form.controls.officeName.value;
    localStorage.setItem('officeName', officeName);
    this.officeName = officeName;

    var officeAddress = officeDetailsForm.form.controls.officeAddress.value;
    localStorage.setItem('officeAddress', officeAddress);
    this.officeAddress = officeAddress;

    var opening: string = officeDetailsForm.form.controls.openingHour.value;
    var closing: string = officeDetailsForm.form.controls.closingHour.value;
    var openingHours: string = opening.concat(' - ', closing);
    localStorage.setItem('officeOpeningHours', openingHours);
    this.officeOpeningHours = openingHours;

    this.isEditOfficeDetailsOpen = false;
  }

  submitRoomDetailsForm(roomDetailsForm: NgForm) {
    var roomDetails = roomDetailsForm.form.controls;

    var roomNumber = roomDetails.roomNumber.value;
    var roomLocation = roomDetails.roomLocation.value;
    var roomCapacity = roomDetails.roomCapacity.value;

    var updatedRoom = {
      roomNumber: roomNumber,
      roomLocation: roomLocation,
      roomCapacity: roomCapacity,
    };

    this.rooms[this.editRoomIndex] = updatedRoom;

    this.rooms.sort((a, b) => {
      if (
        Number(a.roomLocation.substring(0, 1)) >
        Number(b.roomLocation.substring(0, 1))
      ) {
        return 1;
      } else if (
        Number(a.roomLocation.substring(0, 1)) <
        Number(b.roomLocation.substring(0, 1))
      ) {
        return -1;
      } else {
        return 0;
      }
    });

    localStorage.setItem('rooms', JSON.stringify(this.rooms));
    this.isEditRoomDetailsOpen = false;
  }

  submitAddRoomForm(addRoomForm: NgForm) {
    var roomDetails = addRoomForm.form.controls;

    var roomNumber = roomDetails.roomNumber.value;
    var roomLocation = roomDetails.roomLocation.value;
    var roomCapacity = roomDetails.roomCapacity.value;

    var newRoom = {
      roomNumber: roomNumber,
      roomLocation: roomLocation,
      roomCapacity: roomCapacity,
    };

    this.rooms.push(newRoom);
    this.rooms.sort((a, b) => {
      if (
        Number(a.roomLocation.substring(0, 1)) >
        Number(b.roomLocation.substring(0, 1))
      ) {
        return 1;
      } else if (
        Number(a.roomLocation.substring(0, 1)) <
        Number(b.roomLocation.substring(0, 1))
      ) {
        return -1;
      } else {
        return 0;
      }
    });

    localStorage.setItem('rooms', JSON.stringify(this.rooms));
    this.isAddRoomOpen = false;
    this.ngOnInit();
  }
}
