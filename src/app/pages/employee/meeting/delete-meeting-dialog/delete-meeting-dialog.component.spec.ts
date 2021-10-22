import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMeetingDialogComponent } from './delete-meeting-dialog.component';

describe('DeleteMeetingDialogComponent', () => {
  let component: DeleteMeetingDialogComponent;
  let fixture: ComponentFixture<DeleteMeetingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMeetingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMeetingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
