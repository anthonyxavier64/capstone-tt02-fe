import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMeetingDialogComponent } from './update-meeting-dialog.component';

describe('UpdateMeetingDialogComponent', () => {
  let component: UpdateMeetingDialogComponent;
  let fixture: ComponentFixture<UpdateMeetingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMeetingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMeetingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
