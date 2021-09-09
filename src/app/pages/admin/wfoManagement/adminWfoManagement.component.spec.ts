import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminWfoManagementComponent } from './adminWfoManagement.component';

describe('AdminWfoManagementComponent', () => {
  let component: AdminWfoManagementComponent;
  let fixture: ComponentFixture<AdminWfoManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminWfoManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWfoManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
