import { TestBed } from '@angular/core/testing';

import { CovidDocumentSubmissionService } from './covidDocumentSubmission.service';

describe('CovidDocumentSubmissionService', () => {
  let service: CovidDocumentSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidDocumentSubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
