import { TestBed } from '@angular/core/testing';

import { ManualService } from './manual.service';

describe('ManualService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManualService = TestBed.get(ManualService);
    expect(service).toBeTruthy();
  });
});
