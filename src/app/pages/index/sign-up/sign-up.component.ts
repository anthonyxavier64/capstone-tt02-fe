import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TierInfoDialogComponent } from './tier-info-dialog/tier-info-dialog.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  constructor(public tierInfoDialog: MatDialog) {}

  ngOnInit(): void {}

  openTierInfo() {
    const dialogRef = this.tierInfoDialog.open(TierInfoDialogComponent, {
      width: '60vw',
      height: '40vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
