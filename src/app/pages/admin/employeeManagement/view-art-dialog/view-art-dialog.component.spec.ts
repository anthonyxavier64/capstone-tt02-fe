import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewArtComponent } from './view-art-dialog.component';

describe('ViewArtComponent', () => {
  let component: ViewArtComponent;
  let fixture: ComponentFixture<ViewArtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewArtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
