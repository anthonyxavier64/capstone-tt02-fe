import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEmployeeCSVComponent } from './upload-employee-csv.component';

describe('UploadEmployeeCSVComponent', () => {
  let component: UploadEmployeeCSVComponent;
  let fixture: ComponentFixture<UploadEmployeeCSVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadEmployeeCSVComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEmployeeCSVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
