import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassInviteInfoDialogComponent } from './mass-invite-info-dialog.component';

describe('MassInviteInfoDialogComponent', () => {
  let component: MassInviteInfoDialogComponent;
  let fixture: ComponentFixture<MassInviteInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MassInviteInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MassInviteInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
