import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficeQuotaConfigComponent } from './office-quota-config.component';

describe('OfficeQuotaConfigComponent', () => {
  let component: OfficeQuotaConfigComponent;
  let fixture: ComponentFixture<OfficeQuotaConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficeQuotaConfigComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeQuotaConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
