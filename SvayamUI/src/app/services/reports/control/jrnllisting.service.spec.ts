import { TestBed } from '@angular/core/testing';

import { JrnllistingService } from './jrnllisting.service';

describe('JrnllistingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JrnllistingService = TestBed.get(JrnllistingService);
    expect(service).toBeTruthy();
  });
});
