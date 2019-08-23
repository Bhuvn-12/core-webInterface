import { TestBed } from '@angular/core/testing';

import { ArrlistingService } from './arrlisting.service';

describe('ArrlistingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArrlistingService = TestBed.get(ArrlistingService);
    expect(service).toBeTruthy();
  });
});
