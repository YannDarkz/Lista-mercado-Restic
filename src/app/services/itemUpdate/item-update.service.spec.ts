import { TestBed } from '@angular/core/testing';

import { ItemUpdateService } from './item-update.service';

describe('ItemUpdateService', () => {
  let service: ItemUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
