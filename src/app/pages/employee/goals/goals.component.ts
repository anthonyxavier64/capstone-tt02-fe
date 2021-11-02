import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GoalService } from 'src/app/services/goal/goal.service';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
  providers: [MessageService],
})
export class GoalsComponent implements OnInit {
  user: any;
  allGoals: any[];
  unarchivedGoals: any[];
  archivedGoals: any[];
  unassignedTasks: any[];

  isViewArchivedClicked: boolean;
  isLoading: boolean;

  filterValue: string;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private goalService: GoalService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.goalService.getAllGoalsByCompanyId(this.user.companyId).subscribe(
      (response) => {
        this.allGoals = response.goals;
        this.unarchivedGoals = this.allGoals.filter(
          (item) => item.isArchived === false
        );
        this.archivedGoals = this.allGoals.filter(
          (item) => item.isArchived === true
        );
        this.isLoading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Company goals cannot be fetched. Please try again.',
        });
        this.isLoading = false;
      }
    );
  }

  onBackClick(): void {
    this._location.back();
  }

  handleFilter() {
    if (
      this.filterValue === '' ||
      this.filterValue === undefined ||
      this.filterValue === null
    ) {
      this.unarchivedGoals = this.allGoals.filter(
        (item) => item.isArchived === false
      );
      this.archivedGoals = this.allGoals.filter(
        (item) => item.isArchived === true
      );
    } else {
      if (!this.isViewArchivedClicked) {
        this.unarchivedGoals = this.unarchivedGoals.filter((item) =>
          item.name.toLowerCase().includes(this.filterValue.toLowerCase())
        );
      } else if (this.isViewArchivedClicked) {
        this.archivedGoals = this.archivedGoals.filter((item) =>
          item.name.toLowerCase().includes(this.filterValue.toLowerCase())
        );
      }
    }
  }

  viewGoalArchives(): void {
    this.isViewArchivedClicked = !this.isViewArchivedClicked;
  }
}
