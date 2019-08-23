import { TestBed } from '@angular/core/testing';

import { TbalanceService } from './tbalance.service';

describe('TbalanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TbalanceService = TestBed.get(TbalanceService);
    expect(service).toBeTruthy();
  });
});
