import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUnavailableDateComponent } from './manage-unavailable-date.component';

describe('ManageUnavailableDateComponent', () => {
  let component: ManageUnavailableDateComponent;
  let fixture: ComponentFixture<ManageUnavailableDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUnavailableDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUnavailableDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
