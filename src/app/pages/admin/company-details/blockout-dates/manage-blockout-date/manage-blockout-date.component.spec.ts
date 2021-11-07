import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBlockoutDateComponent } from './manage-blockout-date.component';

describe('ManageBlockoutDateComponent', () => {
  let component: ManageBlockoutDateComponent;
  let fixture: ComponentFixture<ManageBlockoutDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageBlockoutDateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBlockoutDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
