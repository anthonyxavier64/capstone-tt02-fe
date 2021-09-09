import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminAnnouncementManagementComponent } from './adminAnnouncementManagement.component';

describe('AdminAnnouncementManagementComponent', () => {
  let component: AdminAnnouncementManagementComponent;
  let fixture: ComponentFixture<AdminAnnouncementManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAnnouncementManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAnnouncementManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
