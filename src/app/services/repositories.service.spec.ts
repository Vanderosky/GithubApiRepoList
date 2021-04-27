import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesService', () => {
  let repoService: RepositoriesService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    repoService = new RepositoriesService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(repoService).toBeTruthy();
  });
});
