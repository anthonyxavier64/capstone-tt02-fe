import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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
  officeOpen: string;
  officeClose: string;
  officeCapacity: number;

  displayEditOfficeDetails: boolean;

  constructor(private _location: Location) {
    this.officeName = 'Company Name';
    this.officeAddress = 'Singapore Street Blk Singapore #SG-SG';
    this.officeOpen = '0800';
    this.officeClose = '2000';
    this.officeOpeningHours = this.officeOpen.concat(' - ', this.officeClose);
    this.officeCapacity = 64;

    this.displayEditOfficeDetails = false;

    //mock room data
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

  ngOnInit(): void {}

  onBackClick() {
    this._location.back();
  }

  openEditOfficeDetailsDialog() {
    this.displayEditOfficeDetails = true;
  }

  saveOfficeDetails() {}

  log() {
    console.log('I have been clicked!');
  }

  submitOfficeDetailsForm() {
    console.log(this.officeName);
  }
}
