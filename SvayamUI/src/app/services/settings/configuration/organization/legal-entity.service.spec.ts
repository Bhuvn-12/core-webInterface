import { TestBed } from '@angular/core/testing';

import { LegalEntityService } from './legal-entity.service';

describe('LegalEntityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LegalEntityService = TestBed.get(LegalEntityService);
    expect(service).toBeTruthy();
  });
});
