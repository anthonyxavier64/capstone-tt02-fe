import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { GoalService } from 'src/app/services/goal/goal.service';

@Component({
  selector: 'app-edit-goal-dialog',
  templateUrl: './edit-goal-dialog.component.html',
  styleUrls: ['./edit-goal-dialog.component.css'],
  providers: [MessageService],
})
export class EditGoalDialogComponent implements OnInit {
  goal: any;
  name: string;
  startDate: Date;

  constructor(
    public dialogRef: MatDialogRef<EditGoalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private goalService: GoalService
  ) {}

  ngOnInit(): void {
    this.goal = this.data.goal;
    this.name = this.goal.name;
    this.startDate = this.goal.startDate;
  }

  updateGoal(): void {
    this.goal = {
      ...this.goal,
      name: this.name,
      startDate: this.startDate,
    };
    this.goalService.updateGoalById(this.goal).subscribe(
      (response) => {
        const updatedGoal = response.goal;
        this.data.goal = updatedGoal;
        this.dialogRef.close({ action: 'SUCCESS', goal: updatedGoal });
      },
      (error) => {
        this.dialogRef.close({ action: 'ERROR' });
      }
    );
  }

  archiveGoal(): void {
    if (this.goal.completionDate !== null) {
      this.goal = {
        ...this.goal,
        isArchived: true,
      };
      this.goalService.updateGoalById(this.goal).subscribe(
        (response) => {
          this.dialogRef.close({ action: 'ARCHIVE', goal: response.goal });
        },
        (error) => {
          this.dialogRef.close({ action: 'ARCHIVE_ERROR' });
        }
      );
    } else {
      this.dialogRef.close({
        action: 'ARCHIVE_ERROR_INCOMPLETE',
        goal: this.goal,
      });
    }
  }

  unarchiveGoal(): void {
    this.goal = {
      ...this.goal,
      isArchived: false,
    };
    this.goalService.updateGoalById(this.goal).subscribe(
      (response) => {
        this.dialogRef.close({ action: 'UNARCHIVE', goal: response.goal });
      },
      (error) => {
        this.dialogRef.close({ action: 'UNARCHIVE_ERROR' });
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close({ action: 'CLOSE' });
  }
}
