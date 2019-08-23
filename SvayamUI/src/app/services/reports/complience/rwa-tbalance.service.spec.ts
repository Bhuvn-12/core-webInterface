import { TestBed } from '@angular/core/testing';

import { RwaTbalanceService } from './rwa-tbalance.service';

describe('RwaTbalanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RwaTbalanceService = TestBed.get(RwaTbalanceService);
    expect(service).toBeTruthy();
  });
});
