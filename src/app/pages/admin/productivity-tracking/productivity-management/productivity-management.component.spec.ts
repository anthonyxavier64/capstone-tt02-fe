import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductivityManagementComponent } from './productivity-management.component';

describe('ProductivityManagementComponent', () => {
  let component: ProductivityManagementComponent;
  let fixture: ComponentFixture<ProductivityManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductivityManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductivityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
