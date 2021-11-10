import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnavailableDateDialogComponent } from './edit-unavailable-date-dialog.component';

describe('EditUnavailableDateDialogComponent', () => {
  let component: EditUnavailableDateDialogComponent;
  let fixture: ComponentFixture<EditUnavailableDateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditUnavailableDateDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnavailableDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
