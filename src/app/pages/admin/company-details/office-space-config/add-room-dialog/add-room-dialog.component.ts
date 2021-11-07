import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-add-room-dialog',
  templateUrl: './add-room-dialog.component.html',
  styleUrls: ['./add-room-dialog.component.css'],
  providers: [MessageService],
})
export class AddRoomDialogComponent implements OnInit {
  company: any;
  rooms: any[];

  constructor(
    public dialogRef: MatDialogRef<AddRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService,
    private roomService: RoomService
  ) {
    this.company = data.company;
    this.rooms = data.rooms;
  }

  ngOnInit(): void {}

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

    this.rooms = this.rooms.slice();

    this.roomService.createRoom(newRoom).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Room has been added.',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Problem adding room. Please try again.',
        });
      }
    );

    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
