import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierInfoDialogComponent } from './tier-info-dialog.component';

describe('TierInfoDialogComponent', () => {
  let component: TierInfoDialogComponent;
  let fixture: ComponentFixture<TierInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TierInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TierInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
