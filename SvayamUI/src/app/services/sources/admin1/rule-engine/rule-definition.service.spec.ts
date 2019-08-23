import { TestBed } from '@angular/core/testing';

import { RuleDefinitionService } from './rule-definition.service';

describe('RuleDefinitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RuleDefinitionService = TestBed.get(RuleDefinitionService);
    expect(service).toBeTruthy();
  });
});
