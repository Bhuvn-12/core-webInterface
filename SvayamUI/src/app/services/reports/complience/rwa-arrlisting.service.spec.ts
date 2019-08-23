import { TestBed } from '@angular/core/testing';

import { RwaArrlistingService } from './rwa-arrlisting.service';

describe('RwaArrlistingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RwaArrlistingService = TestBed.get(RwaArrlistingService);
    expect(service).toBeTruthy();
  });
});
