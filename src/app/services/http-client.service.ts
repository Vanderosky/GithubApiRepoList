import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repo, User } from './types';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private apiUrl = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  fetchReposByUserName(
    userName: string,
    perPage?: number,
    page?: number
  ): Observable<Repo[]> {
    let perPageUrl = '';

    if (perPage) {
      perPageUrl += '?per_page=' + perPage.toString();
    } else {
      perPageUrl += '?per_page=' + '30';
    }
    if (page) {
      perPageUrl += '&page=' + page.toString();
    }

    return this.http
      .get<Repo[]>(this.apiUrl + '/users/' + userName + '/repos' + perPageUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  fetchUser(userName: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/users/' + userName).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
