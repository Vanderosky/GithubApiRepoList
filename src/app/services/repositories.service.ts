import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Owner, Repo } from './types';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {

  private API_URL = 'https://api.github.com';


  constructor(private http: HttpClient) { }

  performGet(URL: string): Observable<Response> {
    return this.http.get(URL).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: Response) => {
        return throwError('An error occurred');
      })
    );
  }

  fetchReposByUserName(userName: string): Observable<Repo[]> {
    return this.performGet(this.API_URL + '/users/' + userName + '/repos')
    .pipe(
      map((response: Response) => {
        return this.mapAllReposInfo(response);
      })
    );
  }

  mapAllReposInfo(details: any): Repo[] {
    const userRepos: Repo[] = [];
    for (const i in details) {
      if (details[i]) {
        userRepos.push(this.mapSingleRepoInfo(details[i]));
      }
    }
    return userRepos;
  }

  mapSingleRepoInfo(data: any): Repo {
    const repo: Repo = {
      name: data.name,
      id: data.id,
      stars: data.stargazers_count,
      forks: data.forks,
      owner: this.mapOwner(data.owner)
    };
    return repo;
  }

  mapOwner(data: any): Owner {
    const owner: Owner = {
      login: data.login,
      id: data.id,
      avatar_url: data.avatar_url
    };
    return owner;
  }
}

