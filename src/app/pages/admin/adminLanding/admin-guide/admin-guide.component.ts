import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-guide',
  templateUrl: './admin-guide.component.html',
  styleUrls: ['./admin-guide.component.css']
})
export class AdminGuideComponent implements OnInit {
  user: any | null;

  constructor(public dialogRef: MatDialogRef<AdminGuideComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = null;
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }

}
