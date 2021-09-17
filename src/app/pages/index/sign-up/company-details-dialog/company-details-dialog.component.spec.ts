import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailsDialogComponent } from './company-details-dialog.component';

describe('CompanyDetailsDialogComponent', () => {
  let component: CompanyDetailsDialogComponent;
  let fixture: ComponentFixture<CompanyDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
