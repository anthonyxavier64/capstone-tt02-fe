import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentInChargeOfComponent } from './department-in-charge-of.component';

describe('DepartmentInChargeOfComponent', () => {
  let component: DepartmentInChargeOfComponent;
  let fixture: ComponentFixture<DepartmentInChargeOfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentInChargeOfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentInChargeOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
