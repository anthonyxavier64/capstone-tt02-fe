import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeSpaceConfigComponent } from './office-space-config.component';

describe('OfficeSpaceConfigComponent', () => {
  let component: OfficeSpaceConfigComponent;
  let fixture: ComponentFixture<OfficeSpaceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeSpaceConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeSpaceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
