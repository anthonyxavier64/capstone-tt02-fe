import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExceptionDialogComponent } from './edit-exception-dialog.component';

describe('EditExceptionDialogComponent', () => {
  let component: EditExceptionDialogComponent;
  let fixture: ComponentFixture<EditExceptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditExceptionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExceptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
