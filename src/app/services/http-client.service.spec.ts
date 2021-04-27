import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpClientService } from './http-client.service';

describe('HttpClientService', () => {
  let service: HttpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
