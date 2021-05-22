import { TestBed } from '@angular/core/testing';

import { MantenedorService } from './mantenedor.service';

describe('MantenedorService', () => {
  let service: MantenedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MantenedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
