import { TestBed } from '@angular/core/testing';

import { InstumentService } from './instument.service';

describe('InstumentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstumentService = TestBed.get(InstumentService);
    expect(service).toBeTruthy();
  });
});
