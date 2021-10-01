import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShnDeclarationDialogComponent } from './shn-declaration-dialog.component';

describe('ShnDeclarationDialogComponent', () => {
  let component: ShnDeclarationDialogComponent;
  let fixture: ComponentFixture<ShnDeclarationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShnDeclarationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShnDeclarationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
