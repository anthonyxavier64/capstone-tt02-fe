import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-edit-room-details-dialog',
  templateUrl: './edit-room-details-dialog.component.html',
  styleUrls: ['./edit-room-details-dialog.component.css'],
  providers: [MessageService],
})
export class EditRoomDetailsDialogComponent implements OnInit {
  room: any;
  rooms: any[];
  editRoomIndex: number;

  name: string;
  location: string;
  capacity: number;

  constructor(
    public dialogRef: MatDialogRef<EditRoomDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService,
    private roomService: RoomService
  ) {
    this.room = data.room;
    this.rooms = data.rooms;
    this.editRoomIndex = data.editRoomIndex;

    this.name = this.room.name;
    this.location = this.room.location;
    this.capacity = this.room.capacity;
  }

  ngOnInit(): void {}

  submitRoomDetailsForm(roomDetailsForm: NgForm) {
    var roomDetails = roomDetailsForm.value;

    var roomName = roomDetails.name;
    var roomLocation = roomDetails.location;
    var roomCapacity = roomDetails.capacity;

    const oldRoom = this.room;

    const storedOldRoom = {
      name: oldRoom.name,
      location: oldRoom.location,
      capacity: oldRoom.capacity,
    };

    oldRoom.name = roomName;
    oldRoom.location = roomLocation;
    oldRoom.capacity = roomCapacity;

    // api call
    this.roomService.updateRoom(oldRoom).subscribe(
      (response) => {
        this.dialogRef.close({ action: 'UPDATE_ROOM SUCCESS' });
      },
      (error) => {
        oldRoom.name = storedOldRoom.name;
        oldRoom.location = storedOldRoom.location;
        oldRoom.capacity = storedOldRoom.capacity;

        this.dialogRef.close({ action: 'UPDATE_ROOM ERROR' });
      }
    );
  }

  deleteRoom() {
    const roomToDelete = this.room;

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

      this.roomService.deleteRoom(roomToDelete.roomId).subscribe(
        (response) => {
          this.dialogRef.close({ action: 'DELETE_ROOM SUCCESS' });
        },
        (error) => {
          this.dialogRef.close({ action: 'DELETE_ROOM ERROR' });
        }
      );

    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to delete room. Please try again.',
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ action: 'CLOSED' });
  }
}
