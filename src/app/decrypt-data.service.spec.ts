import { TestBed } from '@angular/core/testing';

import { DecryptDataService } from './decrypt-data.service';

describe('DecryptDataService', () => {
  let service: DecryptDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecryptDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
