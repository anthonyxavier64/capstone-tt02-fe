import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVaccinationDialogComponent } from './upload-vaccination-dialog.component';

describe('UploadVaccinationDialogComponent', () => {
  let component: UploadVaccinationDialogComponent;
  let fixture: ComponentFixture<UploadVaccinationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadVaccinationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadVaccinationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
