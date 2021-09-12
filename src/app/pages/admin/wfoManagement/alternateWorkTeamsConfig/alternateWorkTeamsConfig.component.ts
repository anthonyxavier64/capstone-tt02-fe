import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-alternate-work-teams-config',
  templateUrl: './alternateWorkTeamsConfig.component.html',
  styleUrls: ['./alternateWorkTeamsConfig.component.css'],
})
export class AlternateWorkTeamsConfigComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit(): void {}

  onBackClick() {
    this._location.back();
  }
}
