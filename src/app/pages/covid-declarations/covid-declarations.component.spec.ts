import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidDeclarationsComponent } from './covid-declarations.component';

describe('CovidDeclarationsComponent', () => {
  let component: CovidDeclarationsComponent;
  let fixture: ComponentFixture<CovidDeclarationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidDeclarationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidDeclarationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
