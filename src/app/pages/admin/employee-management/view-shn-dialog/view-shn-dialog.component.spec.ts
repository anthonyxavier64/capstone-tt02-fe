import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShnDeclarationDialog } from './view-shn-dialog.component';

describe('ViewShnDeclarationDialog', () => {
  let component: ViewShnDeclarationDialog;
  let fixture: ComponentFixture<ViewShnDeclarationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewShnDeclarationDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewShnDeclarationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
