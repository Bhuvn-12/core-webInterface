import { TestBed } from '@angular/core/testing';

import { SourceSystemSetupService } from './source-system-setup.service';

describe('SourceSystemSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SourceSystemSetupService = TestBed.get(SourceSystemSetupService);
    expect(service).toBeTruthy();
  });
});
