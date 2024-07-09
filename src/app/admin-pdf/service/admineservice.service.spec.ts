import { TestBed } from '@angular/core/testing';

import { AdmineserviceService } from './admineservice.service';

describe('AdmineserviceService', () => {
  let service: AdmineserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdmineserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
