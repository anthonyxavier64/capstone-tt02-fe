import { TestBed } from '@angular/core/testing';

import { UnavailableDateService } from './unavailable-date.service';

describe('UnavailableDateService', () => {
  let service: UnavailableDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnavailableDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
