import { TestBed } from '@angular/core/testing';

import { AlternateWorkTeamsConfigurationService } from './alternate-work-teams-configuration.service';

describe('AlternateWorkTeamsConfigurationService', () => {
  let service: AlternateWorkTeamsConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlternateWorkTeamsConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
