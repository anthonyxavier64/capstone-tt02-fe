import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCompanyDetailsManagementComponent } from './adminCompanyDetailsManagement.component';

describe('AdminCompanyDetailsManagementComponent', () => {
  let component: AdminCompanyDetailsManagementComponent;
  let fixture: ComponentFixture<AdminCompanyDetailsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCompanyDetailsManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCompanyDetailsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
