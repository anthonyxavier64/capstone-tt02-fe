import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewGoalDialogComponent } from './create-new-goal-dialog.component';

describe('CreateNewGoalDialogComponent', () => {
  let component: CreateNewGoalDialogComponent;
  let fixture: ComponentFixture<CreateNewGoalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewGoalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewGoalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
