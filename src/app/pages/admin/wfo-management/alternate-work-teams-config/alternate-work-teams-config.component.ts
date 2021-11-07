import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlternateWorkTeamsConfigurationService } from '../../../../services/wfoConfiguration/alternateWorkTeamsConfiguration/alternate-work-teams-configuration.service';

@Component({
  selector: 'app-admin-alternate-work-teams-config',
  templateUrl: './alternate-work-teams-config.component.html',
  styleUrls: ['./alternate-work-teams-config.component.css'],
  providers: [MessageService],
})
export class AlternateWorkTeamsConfigComponent implements OnInit {
  company: any | null;
  alternateWorkTeamsConfigurationId: number;
  alternateWorkTeamsConfig: any | null;

  teamAUsers: any | null;
  teamBUsers: any | null;

  isLoading: boolean = true;
  isHovering: boolean = false;
  teamA: any | null = [];
  teamB: any | null = [];

  selectedEmployeeTeamA: any | null;
  selectedEmployeeTeamB: any | null;

  isDailySelected: boolean = false;
  isWeeklySelected: boolean = false;
  isBiWeeklySelected: boolean = false;
  isMonthlySelected: boolean = false;

  selectedConfig: String;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private companyDetailsService: CompanyDetailsService,
    private userService: UserService,
    private alternateWorkTeamsConfigurationService: AlternateWorkTeamsConfigurationService
  ) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;

          if (this.company.alternateWorkTeamsConfigurationId === null) {
            this.alternateWorkTeamsConfigurationId = null;
            this.isDailySelected = true;
            this.isLoading = false;

            this.userService.getUsers(companyId).subscribe((response) => {
              this.teamAUsers = response.users;
              this.teamBUsers = response.users;
            });
          } else {
            this.alternateWorkTeamsConfigurationService
              .getAlternateWorkTeamsConfiguration(
                this.company.alternateWorkTeamsConfigurationId
              )
              .subscribe((response) => {
                this.alternateWorkTeamsConfigurationId =
                  this.company.alternateWorkTeamsConfigurationId;
                this.alternateWorkTeamsConfig =
                  response.alternateWorkTeamsConfig;
                this.teamA = this.alternateWorkTeamsConfig.teamA;
                this.teamB = this.alternateWorkTeamsConfig.teamB;
                this.selectedConfig =
                  this.alternateWorkTeamsConfig.scheduleType;

                if (this.selectedConfig === 'DAILY') {
                  this.isDailySelected = true;
                } else if (this.selectedConfig === 'WEEKLY') {
                  this.isWeeklySelected = true;
                } else if (this.selectedConfig === 'BIWEEKLY') {
                  this.isBiWeeklySelected = true;
                } else if (this.selectedConfig === 'MONTHLY') {
                  this.isMonthlySelected = true;
                }

                this.userService.getUsers(companyId).subscribe((response) => {
                  const populateTeamAArr = [];
                  const populateTeamBArr = [];
                  for (let user of response.users) {
                    const userModel = {
                      userId: user.userId,
                      fullName: user.fullName,
                      isVaccinated: user.isVaccinated,
                    };

                    const insideTeamA = this.teamA.find(
                      (item) => item.userId === userModel.userId
                    );
                    const insideTeamB = this.teamB.find(
                      (item) => item.userId === userModel.userId
                    );

                    if (!insideTeamA && !insideTeamB) {
                      populateTeamAArr.push(userModel);
                      populateTeamBArr.push(userModel);
                    }
                  }

                  this.teamAUsers = populateTeamAArr;
                  this.teamBUsers = populateTeamBArr;
                });

                this.isLoading = false;
              });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Company not found',
          });
        }
      );
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
    if (!this.teamBUsers.find((item) => item.userId === employee.userId)) {
      this.teamBUsers.push(employee);
    }
    if (!this.teamAUsers.find((item) => item.userId === employee.userId)) {
      this.teamAUsers.push(employee);
    }
  }

  onTeamBEmployeeDelete(employee: any): void {
    const indexToRemove = this.teamB.indexOf(employee);
    this.teamB.splice(indexToRemove, 1);

    //Add removed user back to selectable list
    if (!this.teamBUsers.find((item) => item.userId === employee.userId)) {
      this.teamBUsers.push(employee);
    }
    if (!this.teamAUsers.find((item) => item.userId === employee.userId)) {
      this.teamAUsers.push(employee);
    }
  }

  toggleTeamMembers() {
    const tempTeamA = this.teamA;
    this.teamA = this.teamB;
    this.teamB = tempTeamA;

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Members of Teams A and B have been swapped.',
    });
  }

  selectDailyConfig(): void {
    this.selectedConfig = 'DAILY';
    this.isDailySelected = true;
    this.isWeeklySelected = false;
    this.isBiWeeklySelected = false;
    this.isMonthlySelected = false;
  }

  selectWeeklyConfig(): void {
    this.selectedConfig = 'WEEKLY';
    this.isDailySelected = false;
    this.isWeeklySelected = true;
    this.isBiWeeklySelected = false;
    this.isMonthlySelected = false;
  }

  selectBiweeklyConfig(): void {
    this.selectedConfig = 'BIWEEKLY';
    this.isDailySelected = false;
    this.isWeeklySelected = false;
    this.isBiWeeklySelected = true;
    this.isMonthlySelected = false;
  }

  selectMonthlyConfig(): void {
    this.selectedConfig = 'MONTHLY';
    this.isDailySelected = false;
    this.isWeeklySelected = false;
    this.isBiWeeklySelected = false;
    this.isMonthlySelected = true;
  }

  createAlternateWorkTeamsConfiguration() {
    const newConfig = {
      scheduleType: this.selectedConfig,
      teamA: this.teamA,
      teamB: this.teamB,
    };

    //Bind employee to the team they belong to
    for (let user of this.teamA) {
      const wfoTeamAllocation = {
        userId: user.userId,
        fullName: user.fullName,
        alternateWfoTeam: 'A',
      };
      this.userService
        .updateUserDetailsByUserId(user.userId, wfoTeamAllocation)
        .subscribe(
          (response) => {},
          (error) => {}
        );
    }

    for (let user of this.teamB) {
      const wfoTeamAllocation = {
        userId: user.userId,
        fullName: user.fullName,
        alternateWfoTeam: 'B',
      };
      this.userService
        .updateUserDetailsByUserId(user.userId, wfoTeamAllocation)
        .subscribe(
          (response) => {},
          (error) => {}
        );
    }

    //Create Alternate Work Teams Config and Bind to Company
    this.alternateWorkTeamsConfigurationService
      .createAlternateWorkTeamsConfiguration(newConfig)
      .subscribe((response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Alternate Work Teams Configuration has been added.',
        });

        this.alternateWorkTeamsConfigurationId =
          response.alternateWorkTeamsConfig.alternateWorkTeamsConfigurationId;

        const updateCompany = {
          ...this.company,
          alternateWorkTeamsConfigurationId:
            this.alternateWorkTeamsConfigurationId,
        };

        this.companyDetailsService.updateCompany(updateCompany).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail:
                'Alternate Work Teams Configuration has been binded to the company.',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Problem adding configuration. Please try again.',
            });
          }
        );
      });
  }

  updateAlternateWorkTeamsConfiguration() {
    const newConfig = {
      alternateWorkTeamsConfigurationId: this.alternateWorkTeamsConfigurationId,
      scheduleType: this.selectedConfig,
      teamA: this.teamA,
      teamB: this.teamB,
    };

    //Bind employee to the team they belong to
    for (let user of this.teamA) {
      const wfoTeamAllocation = {
        userId: user.userId,
        fullName: user.fullName,
        alternateWfoTeam: 'A',
      };
      this.userService
        .updateUserDetailsByUserId(user.userId, wfoTeamAllocation)
        .subscribe(
          (response) => {},
          (error) => {}
        );
    }

    for (let user of this.teamB) {
      const wfoTeamAllocation = {
        userId: user.userId,
        fullName: user.fullName,
        alternateWfoTeam: 'B',
      };
      this.userService
        .updateUserDetailsByUserId(user.userId, wfoTeamAllocation)
        .subscribe(
          (response) => {},
          (error) => {}
        );
    }

    this.alternateWorkTeamsConfigurationService
      .updateAlternateWorkTeamsConfiguration(newConfig)
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Alternate Work Teams Configuration has been updated.',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Problem updating configuration. Please try again.',
          });
        }
      );
  }

  onSave(): void {
    if (this.alternateWorkTeamsConfigurationId === null) {
      this.createAlternateWorkTeamsConfiguration();
    } else {
      this.updateAlternateWorkTeamsConfiguration();
    }
  }
}
