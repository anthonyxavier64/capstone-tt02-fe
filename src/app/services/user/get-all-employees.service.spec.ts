import { TestBed } from '@angular/core/testing';

import { GetAllEmployeesService } from './get-all-employees.service';

describe('GetAllEmployeesService', () => {
  let service: GetAllEmployeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllEmployeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
