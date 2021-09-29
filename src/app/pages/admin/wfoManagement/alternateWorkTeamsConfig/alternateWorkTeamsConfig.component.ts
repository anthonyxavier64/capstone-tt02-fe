import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-admin-alternate-work-teams-config',
  templateUrl: './alternateWorkTeamsConfig.component.html',
  styleUrls: ['./alternateWorkTeamsConfig.component.css'],
  providers: [MessageService],
})
export class AlternateWorkTeamsConfigComponent implements OnInit {
  company: any | null;
  teamAUsers: any | null;
  teamBUsers: any | null;

  isLoading: boolean = false;
  isHovering: boolean = false;
  teamA: any | null;
  teamB: any | null;

  selectedEmployeeTeamA: any | null;
  selectedEmployeeTeamB: any | null;

  isDailySelected: boolean = false;
  isWeeklySelected: boolean = false;
  isBiWeeklySelected: boolean = false;
  isMonthlySelected: boolean = false;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private companyDetailsService: CompanyDetailsService,
    private userService: UserService
  ) {
    this.teamA = [
      { fullName: 'Bob' },
      { fullName: 'Charlie' },
      { fullName: 'Sam' },

      // NOTE: TO MAKE COMPONENT RESPONSIVE/SCROLLABLE WITH MORE USERS
      // { fullName: 'George' },
      // { fullName: 'Greg' },
      // { fullName: 'Jimmy' },
    ];

    this.teamB = [
      { fullName: 'Grace' },
      { fullName: 'Lucy' },
      { fullName: 'Amanda' },

      // NOTE: TO MAKE COMPONENT RESPONSIVE/SCROLLABLE WITH MORE USERS
      // { fullName: 'Allison' },
      // { fullName: 'Sarah' },
      // { fullName: 'Jovanne' },
    ];
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Company not found',
          });
        }
      );

      this.userService.getUsers(companyId).subscribe((response) => {
        this.teamAUsers = response.users;
        this.teamBUsers = response.users;
      });
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  addToTeamA(formValue: NgForm): void {
    const userToAdd = formValue.value.selectedEmployeeTeamA;
    this.teamA.push(userToAdd);

    //Remove user so that he cannot be selected for team B
    const indexToRemove = this.teamBUsers.indexOf(userToAdd);
    this.teamBUsers.splice(indexToRemove, 1);

    formValue.resetForm();
  }

  addToTeamB(formValue: NgForm): void {
    const userToAdd = formValue.value.selectedEmployeeTeamB;
    this.teamB.push(userToAdd);

    //Remove user so that he cannot be selected for team A
    const indexToRemove = this.teamAUsers.indexOf(userToAdd);
    this.teamAUsers.splice(indexToRemove, 1);

    formValue.resetForm();
  }

  onTeamAEmployeeDelete(employee: any): void {
    const indexToRemove = this.teamA.indexOf(employee);
    this.teamA.splice(indexToRemove, 1);

    //Add removed user back to selectable list
    this.teamAUsers.push(employee);
  }

  onTeamBEmployeeDelete(employee: any): void {
    const indexToRemove = this.teamB.indexOf(employee);
    this.teamB.splice(indexToRemove, 1);

    //Add removed user back to selectable list
    this.teamBUsers.push(employee);
  }

  selectDailyConfig(): void {
    this.isDailySelected = true;
    this.isWeeklySelected = false;
    this.isBiWeeklySelected = false;
    this.isMonthlySelected = false;
  }

  selectWeeklyConfig(): void {
    this.isDailySelected = false;
    this.isWeeklySelected = true;
    this.isBiWeeklySelected = false;
    this.isMonthlySelected = false;
  }

  selectBiweeklyConfig(): void {
    this.isDailySelected = false;
    this.isWeeklySelected = false;
    this.isBiWeeklySelected = true;
    this.isMonthlySelected = false;
  }

  selectMonthlyConfig(): void {
    this.isDailySelected = false;
    this.isWeeklySelected = false;
    this.isBiWeeklySelected = false;
    this.isMonthlySelected = true;
  }
}
