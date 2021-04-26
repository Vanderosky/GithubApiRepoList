import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Owner, Repo } from './types';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {

  private API_URL = 'https://api.github.com';


  constructor(private http: HttpClient) { }

  fetchReposByUserName(userName: string): Observable<Repo[]> {
    return this.http.get<Repo[]>(this.API_URL + '/users/' + userName + '/repos')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }
}

