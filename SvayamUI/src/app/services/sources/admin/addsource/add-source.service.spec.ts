import { TestBed } from '@angular/core/testing';

import { AddSourceService } from './add-source.service';

describe('AddSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddSourceService = TestBed.get(AddSourceService);
    expect(service).toBeTruthy();
  });
});
