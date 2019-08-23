import { TestBed } from '@angular/core/testing';

import { EntityrefreshService } from './entityrefresh.service';

describe('EntityrefreshService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntityrefreshService = TestBed.get(EntityrefreshService);
    expect(service).toBeTruthy();
  });
});
