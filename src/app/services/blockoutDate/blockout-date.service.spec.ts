import { TestBed } from '@angular/core/testing';

import { BlockoutDateService } from './blockout-date.service';

describe('BlockoutDateService', () => {
  let service: BlockoutDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockoutDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
