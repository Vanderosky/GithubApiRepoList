import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repo, User } from './types';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class RepositoriesService {
  private API_URL = 'https://api.github.com';

  constructor(private httpClientService: HttpClientService) {}

  fetchAllReposByUserName(
    userName: string,
    perPage: number,
    reposCount: number
  ): Observable<any[]> {
    const AllRepos: Observable<Repo[]>[] = [];
    const iterations = reposCount / perPage;
    for (let i = 1; i < iterations + 1; i++) {
      AllRepos.push(this.httpClientService.fetchReposByUserName(userName, perPage, i));
    }
    return forkJoin(AllRepos).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
