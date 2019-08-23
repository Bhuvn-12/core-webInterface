import { TestBed } from '@angular/core/testing';

import { AccountingcontrolService } from './accountingcontrol.service';

describe('AccountingcontrolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountingcontrolService = TestBed.get(AccountingcontrolService);
    expect(service).toBeTruthy();
  });
});
