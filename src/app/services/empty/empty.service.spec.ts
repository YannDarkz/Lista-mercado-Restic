import { TestBed } from '@angular/core/testing';

import { EmptyService } from './empty.service';

describe('EmptyService', () => {
  let service: EmptyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmptyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
