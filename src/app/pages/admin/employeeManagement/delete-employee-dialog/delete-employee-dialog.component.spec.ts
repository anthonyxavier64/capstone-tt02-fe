import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEmployeeDialogRefComponent } from './delete-employee-dialog.component';

describe('DeleteEmployeeDialogRefComponent', () => {
  let component: DeleteEmployeeDialogRefComponent;
  let fixture: ComponentFixture<DeleteEmployeeDialogRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEmployeeDialogRefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEmployeeDialogRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
