import { MessageService } from 'primeng/api';
import { CompanyService } from 'src/app/services/company/company.service';
import { RoomService } from 'src/app/services/room/room.service';

import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AddRoomDialogComponent } from './add-room-dialog/add-room-dialog.component';
import { EditOfficeDetailsDialogComponent } from './edit-office-details-dialog/edit-office-details-dialog.component';
import { EditRoomDetailsDialogComponent } from './edit-room-details-dialog/edit-room-details-dialog.component';

@Component({
  selector: 'app-office-space-config',
  templateUrl: './office-space-config.component.html',
  styleUrls: ['./office-space-config.component.css'],
  providers: [MessageService],
})
export class OfficeSpaceConfigComponent implements OnInit {
  rooms: any[] = [];

  company: any | undefined;
  companyId: any | undefined;

  editRoomIndex: number; //used to search up the item within the array of rooms

  isEditOfficeDetailsOpen: boolean = false;
  datePipe: DatePipe;

  constructor(
    private _location: Location,
    private router: Router,
    private companyService: CompanyService,
    private messageService: MessageService,
    private roomService: RoomService,
    private dialog: MatDialog
  ) {
    const currentNav = this.router.getCurrentNavigation();
    if (currentNav) {
      this.companyId = currentNav.extras.state;
      this.datePipe = new DatePipe('en-US');
    }
  }

  ngOnInit(): void {
    this.companyService.getCompany(this.companyId).subscribe(
      (response) => {
        this.company = response.company;
        this.rooms = this.company.rooms;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
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
    let dialogRef = this.dialog.open(EditOfficeDetailsDialogComponent, {
      data: {
        company: this.company,
      },
      panelClass: 'office-card',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.action === 'SUCCESS') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Company office details updated successfully.',
            });
        } else if (result.action === 'ERROR') {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to update company office details. Please try again.',
          });
        }
      });
  }

  openEditRoomDetailsDialog(roomItem: any) {
    this.editRoomIndex = this.rooms.findIndex((room) => room === roomItem);
    var room = this.rooms[this.editRoomIndex];
    let dialogRef = this.dialog.open(EditRoomDetailsDialogComponent, {
      data: {
        room: room,
        rooms: this.rooms,
        editRoomIndex: this.editRoomIndex,
      },
      panelClass: 'room-card',
    });

    dialogRef.afterClosed().subscribe((result) => {
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

      if (result.action === 'UPDATE_ROOM SUCCESS') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Room Details updated successfully.',
        });
      } else if (result.action === 'UPDATE_ROOM ERROR') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to update room details. Please try again.',
        });
      } else if (result.action === 'DELETE_ROOM SUCCESS') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Room has been deleted.',
        });
      } else if (result.action === 'DELETE_ROOM ERROR') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to delete room. Please try again.',
        });
      }
    });
  }

  openAddRoomDialog() {
    let dialogRef = this.dialog.open(AddRoomDialogComponent, {
      data: {
        company: this.company,
        rooms: this.rooms,
      },
      panelClass: 'room-card',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.action === 'SUCCESS') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'New room added successfully.',
          });
      } else if (result.action === 'ERROR') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to add new room. Please try again.',
        });
      }
    });
  }
}
