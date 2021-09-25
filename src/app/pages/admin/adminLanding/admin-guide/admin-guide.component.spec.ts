import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGuideComponent } from './admin-guide.component';

describe('AdminGuideComponent', () => {
  let component: AdminGuideComponent;
  let fixture: ComponentFixture<AdminGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGuideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
