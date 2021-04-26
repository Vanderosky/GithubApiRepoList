import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repo, User } from './types';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {

  private API_URL = 'https://api.github.com';


  constructor(private http: HttpClient) { }

  fetchReposByUserName(userName: string, perPage?: number, page?: number): Observable<Repo[]> {
    let perPageUrl = '';

    if (perPage) {
      perPageUrl = '?per_page=' + perPage.toString();
    }
    if (page) {
      perPageUrl = '?page=' + page.toString();
    }
    if (perPage && page) {
      perPageUrl = '?per_page=' + perPage.toString() + '&page=' + page.toString();
    }

    return this.http.get<Repo[]>(this.API_URL + '/users/' + userName + '/repos' + perPageUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  fetchUser(userName: string): Observable<User> {
    return this.http.get<User>(this.API_URL + '/users/' + userName)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }
}

