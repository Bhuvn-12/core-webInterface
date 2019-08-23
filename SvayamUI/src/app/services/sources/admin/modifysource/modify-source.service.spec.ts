import { TestBed } from '@angular/core/testing';

import { ModifySourceService } from './modify-source.service';

describe('ModifySourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModifySourceService = TestBed.get(ModifySourceService);
    expect(service).toBeTruthy();
  });
});
