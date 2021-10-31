import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoomDetailsDialogComponent } from './edit-room-details-dialog.component';

describe('EditRoomDetailsDialogComponent', () => {
  let component: EditRoomDetailsDialogComponent;
  let fixture: ComponentFixture<EditRoomDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRoomDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoomDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
