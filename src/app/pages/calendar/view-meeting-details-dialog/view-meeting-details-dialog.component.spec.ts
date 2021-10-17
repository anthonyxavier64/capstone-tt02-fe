import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMeetingDetailsDialogComponent } from './view-meeting-details-dialog.component';

describe('ViewMeetingDetailsDialogComponent', () => {
  let component: ViewMeetingDetailsDialogComponent;
  let fixture: ComponentFixture<ViewMeetingDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMeetingDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMeetingDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
