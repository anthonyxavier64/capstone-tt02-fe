import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewMeetingComponent } from './create-new-meeting.component';

describe('CreateNewMeetingComponent', () => {
  let component: CreateNewMeetingComponent;
  let fixture: ComponentFixture<CreateNewMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
