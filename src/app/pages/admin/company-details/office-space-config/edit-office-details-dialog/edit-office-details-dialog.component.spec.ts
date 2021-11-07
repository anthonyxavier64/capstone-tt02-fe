import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOfficeDetailsDialogComponent } from './edit-office-details-dialog.component';

describe('EditOfficeDetailsDialogComponent', () => {
  let component: EditOfficeDetailsDialogComponent;
  let fixture: ComponentFixture<EditOfficeDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOfficeDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfficeDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
