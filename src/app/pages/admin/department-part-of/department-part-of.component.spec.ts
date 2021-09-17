import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentPartOfComponent } from './department-part-of.component';

describe('DepartmentPartOfComponent', () => {
  let component: DepartmentPartOfComponent;
  let fixture: ComponentFixture<DepartmentPartOfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentPartOfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentPartOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
