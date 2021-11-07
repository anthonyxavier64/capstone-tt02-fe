import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBlockoutDateDialogComponent } from './edit-blockout-date-dialog.component';

describe('EditBlockoutDateDialogComponent', () => {
  let component: EditBlockoutDateDialogComponent;
  let fixture: ComponentFixture<EditBlockoutDateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBlockoutDateDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBlockoutDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
