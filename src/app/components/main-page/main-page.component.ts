import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoriesService } from 'src/app/services/repositories.service';
import { Repo } from 'src/app/services/types';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  fetchedRepos: Repo[] = [];
  repos: Repo[] = [];
  reposCount = 0;
  isFetched = false;
  userRouterName = '';
  error = 0;

  constructor(private repoService: RepositoriesService, private route: ActivatedRoute, private router: Router) { }

  userFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    this.getRouteParameter();
  }

  fetchReposData(user: string): void {
    this.repoService.fetchUser(user).subscribe({
      next: userInfo => {
        this.reposCount = userInfo.public_repos;
      },
      error: error => {
        this.error = error.status;
      },
      complete: () => {
        this.repoService.fetchAllReposByUserName(user, 100, this.reposCount).subscribe({
          next: repoData => {
            this.fetchedRepos = this.sortReposByStars([].concat(...repoData));
          },
          error: error => {
            this.error = error.status;
          },
          complete: () => {
            this.paginateRepos(0, 10);
            this.error = 0;
          }
        });
      }
    });
  }

  paginateRepos(pageIndex: number, pageSize: number): void {
    const start = pageIndex * pageSize;
    const end = pageIndex * pageSize + pageSize;
    this.repos = this.fetchedRepos.slice(start, end);
  }

  onChangePage(paginator: PageEvent): void {
    this.paginateRepos(paginator.pageIndex, paginator.pageSize);
  }

  sortReposByStars(repos: Repo[]): Repo[] {
    return repos.sort(this.compareStars);
  }

  compareStars(a: Repo, b: Repo): number {
    if (a.stargazers_count < b.stargazers_count) {
      return -1;
    }
    if (a.stargazers_count > b.stargazers_count) {
      return 1;
    }
    return 0;
  }

  getRouteParameter(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('user')) {
        const userName = params.get('user') || '';
        this.userFormControl.setValue(userName);
        this.fetchReposData(userName);
      }
    });
  }

  searchUserRepos(): void {
    const userName = this.userFormControl.value;
    this.router.navigateByUrl('/' + userName);
  }
}
