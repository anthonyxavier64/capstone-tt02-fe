import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlternateWorkTeamsConfigComponent } from './alternateWorkTeamsConfig.component';

describe('AlternateWorkTeamsConfigComponent', () => {
  let component: AlternateWorkTeamsConfigComponent;
  let fixture: ComponentFixture<AlternateWorkTeamsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlternateWorkTeamsConfigComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternateWorkTeamsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
