import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVaccinationDialogComponent } from './view-vaccination-dialog.component';

describe('ViewVaccinationDialogComponent', () => {
  let component: ViewVaccinationDialogComponent;
  let fixture: ComponentFixture<ViewVaccinationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVaccinationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVaccinationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
