import { Location, DatePipe } from '@angular/common';
import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import { MessageService } from 'primeng/api';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-office-space-config',
  templateUrl: './office-space-config.component.html',
  styleUrls: ['./office-space-config.component.css'],
  providers: [MessageService],
})
export class OfficeSpaceConfigComponent implements OnInit {
  rooms: any[];

  company: any | undefined;
  companyId: any | undefined;

  editRoomIndex: number; //used to search up the item within the array of rooms

  isEditOfficeDetailsOpen: boolean = false;
  isEditRoomDetailsOpen: boolean = false;
  isAddRoomOpen: boolean = false;
  datePipe: DatePipe;

  constructor(
    private _location: Location,
    private router: Router,
    private companyDetailsService: CompanyDetailsService,
    private messageService: MessageService,
    private roomService: RoomService
  ) {
    const currentNav = this.router.getCurrentNavigation();
    if (currentNav) {
      this.companyId = currentNav.extras.state;
      this.datePipe = new DatePipe('en-US');
    }
  }

  ngOnInit(): void {
    this.companyDetailsService.getCompanyById(this.companyId).subscribe(
      (response) => {
        this.company = response.company;
        this.rooms = this.company.rooms;
      },
      (error) => {
        this.messageService.add({
          severity: 'Error',
          summary: 'Error',
          detail: 'Unable to retrieve office details.',
        });
      }
    );
  }

  onBackClick() {
    this._location.back();
  }

  openEditOfficeDetailsDialog() {
    this.isEditOfficeDetailsOpen = true;
  }

  openEditRoomDetailsDialog(roomItem: any) {
    this.isEditRoomDetailsOpen = true;
    this.editRoomIndex = this.rooms.findIndex((room) => room === roomItem);
  }

  deleteRoom() {
    const room = this.rooms[this.editRoomIndex];

    if (this.editRoomIndex > -1) {
      this.rooms.splice(this.editRoomIndex, 1);
      this.rooms.sort((a, b) => {
        if (
          Number(a.location.substring(0, 1)) >
          Number(b.location.substring(0, 1))
        ) {
          return 1;
        } else if (
          Number(a.location.substring(0, 1)) <
          Number(b.location.substring(0, 1))
        ) {
          return -1;
        } else {
          return 0;
        }
      });

      this.roomService.deleteRoom(room.roomId).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Room is deleted.',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to delete room. Please try again.',
          });
        }
      );

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
    const officeDetails = officeDetailsForm.value;

    this.company.officeName = officeDetails.officeName;
    this.company.officeAddress = officeDetails.officeAddress;

    this.company.officeOpeningHour = officeDetails.openingHour;
    this.company.officeClosingHour = officeDetails.closingHour;

    this.companyDetailsService.updateCompany(this.company).subscribe(
      (response) => {
        this.company = response.company;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Office details have been updated.',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to update. Please try again.',
        });
      }
    );

    this.isEditOfficeDetailsOpen = false;
  }

  submitRoomDetailsForm(roomDetailsForm: NgForm) {
    var roomDetails = roomDetailsForm.value;

    var roomName = roomDetails.name;
    var roomLocation = roomDetails.location;
    var roomCapacity = roomDetails.capacity;

    const oldRoom = this.rooms[this.editRoomIndex];

    oldRoom.name = roomName;
    oldRoom.location = roomLocation;
    oldRoom.capacity = roomCapacity;
    console.log(oldRoom);

    this.rooms.sort((a, b) => {
      if (
        Number(a.location.substring(0, 1)) > Number(b.location.substring(0, 1))
      ) {
        return 1;
      } else if (
        Number(a.location.substring(0, 1)) < Number(b.location.substring(0, 1))
      ) {
        return -1;
      } else {
        return 0;
      }
    });

    // api call
    this.roomService.updateRoom(oldRoom).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to update. Please try again.',
        });
      }
    );
    this.isEditRoomDetailsOpen = false;
  }

  submitAddRoomForm(addRoomForm: NgForm) {
    const roomDetails = addRoomForm.value;

    const newRoom = {
      capacity: roomDetails.capacity,
      location: roomDetails.location,
      name: roomDetails.name,
      companyId: this.company.companyId,
    };

    this.rooms.push(newRoom);

    this.rooms.sort((a, b) => {
      if (
        Number(a.location.substring(0, 1)) > Number(b.location.substring(0, 1))
      ) {
        return 1;
      } else if (
        Number(a.location.substring(0, 1)) < Number(b.location.substring(0, 1))
      ) {
        return -1;
      } else {
        return 0;
      }
    });

    this.roomService.createRoom(newRoom).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );

    this.ngOnInit();
    this.isAddRoomOpen = false;
  }

  closeEditOfficeDetails(officeDetailsForm: NgForm) {
    this.isEditOfficeDetailsOpen = false;
    officeDetailsForm.reset();
  }
}
