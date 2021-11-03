import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGoalDialogComponent } from './edit-goal-dialog.component';

describe('EditGoalDialogComponent', () => {
  let component: EditGoalDialogComponent;
  let fixture: ComponentFixture<EditGoalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGoalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGoalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
