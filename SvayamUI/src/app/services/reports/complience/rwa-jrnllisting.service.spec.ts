import { TestBed } from '@angular/core/testing';

import { RwaJrnllistingService } from './rwa-jrnllisting.service';

describe('RwaJrnllistingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RwaJrnllistingService = TestBed.get(RwaJrnllistingService);
    expect(service).toBeTruthy();
  });
});
