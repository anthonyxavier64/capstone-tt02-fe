import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompanyDetailsDialogComponent } from './update-company-details-dialog.component';

describe('UpdateCompanyDetailsDialogComponent', () => {
  let component: UpdateCompanyDetailsDialogComponent;
  let fixture: ComponentFixture<UpdateCompanyDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCompanyDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCompanyDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
