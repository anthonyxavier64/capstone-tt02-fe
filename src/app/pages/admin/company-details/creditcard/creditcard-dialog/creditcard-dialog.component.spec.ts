import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditcardDialogComponent } from './creditcard-dialog.component';

describe('CreditcardDialogComponent', () => {
  let component: CreditcardDialogComponent;
  let fixture: ComponentFixture<CreditcardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditcardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditcardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
