import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductivityDialogComponent } from './view-productivity-dialog.component';

describe('ViewProductivityDialogComponent', () => {
  let component: ViewProductivityDialogComponent;
  let fixture: ComponentFixture<ViewProductivityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProductivityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProductivityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
