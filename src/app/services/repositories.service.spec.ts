import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RepositoriesService } from './repositories.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Repo } from './types';

describe('RepositoriesService', () => {
  let repoService: RepositoriesService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    repoService = new RepositoriesService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(repoService).toBeTruthy();
  });

  it('should return expected Repo (HttpClient called once)', () => {
    const expectedRepo: Repo[] = [
      {
        forks: 40,
        id: 18221276,
        name: 'git-consortium',
        owner: { login: 'octocat', id: 583231, avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4' },
        stars: 19
      }];

    httpClientSpy.get.and.returnValue(of(expectedRepo));

    repoService.fetchReposByUserName('octocat').subscribe(
      repoData => {
        expect(repoData.length).toEqual(expectedRepo.length, 'expected number of Repos');
        expect(repoData[0].name).toEqual(expectedRepo[0].name, 'expected Repo name');
        expect(repoData[0].owner).toEqual(expectedRepo[0].owner, 'expected Repo owner');
      });

    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return an error with bad get argument', () => {
    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(of(errorResponse));

    repoService.fetchReposByUserName('').subscribe(
      repos => fail('expected an error, not repos'),
      error => expect(error.message).toContain('')
    );
  });
});
