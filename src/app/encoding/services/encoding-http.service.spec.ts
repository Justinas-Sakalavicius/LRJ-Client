import { TestBed } from '@angular/core/testing';

import { EncodingHttpService } from './encoding-http.service';

describe('EncodingHttpService', () => {
  let service: EncodingHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncodingHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
