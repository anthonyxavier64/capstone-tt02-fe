import { TestBed } from '@angular/core/testing';
import { OfficeQuotaConfigurationService } from './office-quota-configuration.service';

describe('OfficeQuotaConfigurationService', () => {
  let service: OfficeQuotaConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficeQuotaConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
