import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HttpClientService } from './http-client.service';
import { Repo } from './types';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new HttpClientService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected Repo (HttpClient called once)', () => {
    const expectedRepo: Repo[] = [
      {
        forks: 40,
        id: 18221276,
        name: 'git-consortium',
        owner: {
          login: 'octocat',
          id: 583231,
          avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
        },
        stargazers_count: 19,
        updated_at: new Date(),
        html_url: '',
        open_issues_count: 0,
      },
    ];

    httpClientSpy.get.and.returnValue(of(expectedRepo));

    service.fetchReposByUserName('octocat', 30, 1).subscribe((repoData) => {
      expect(repoData.length).toEqual(
        expectedRepo.length,
        'expected number of Repos'
      );
      expect(repoData[0].name).toEqual(
        expectedRepo[0].name,
        'expected Repo name'
      );
      expect(repoData[0].owner).toEqual(
        expectedRepo[0].owner,
        'expected Repo owner'
      );
    });

    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return an error when the server returns a 404', () => {
    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404,
      statusText: 'Not Found',
    });

    httpClientSpy.get.and.returnValue(of(errorResponse));

    service.fetchReposByUserName('', 30, 1).subscribe(
      (repos) => {},
      (error) => expect(error.message).toContain('404')
    );
  });
});
