import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSelectorDialogComponent } from './color-selector-dialog.component';

describe('ColorSelectorDialogComponent', () => {
  let component: ColorSelectorDialogComponent;
  let fixture: ComponentFixture<ColorSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorSelectorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
