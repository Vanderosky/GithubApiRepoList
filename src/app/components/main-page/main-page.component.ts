import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from 'src/app/services/http-client.service';
import { RepositoriesService } from 'src/app/services/repositories.service';
import { Repo, User } from 'src/app/services/types';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );

  fetchedRepos: Repo[] = [];
  repos: Repo[] = [];
  userRouterName = '';
  errorStatus = 0;
  user: User = { login: '', public_repos: 0}

  constructor(
    private repoService: RepositoriesService,
    private route: ActivatedRoute,
    private router: Router,
    private httpClientService: HttpClientService
  ) {}

  userFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    this.getRouteParameter();
  }

  fetchReposData(user: string): void {
    this.httpClientService.fetchUser(user).subscribe({
      next: (userInfo) => {
        this.user.public_repos = userInfo.public_repos;
        this.user.login = userInfo.login;
      },
      error: (error) => {
        this.errorStatus = error.status;
      },
      complete: () => {
        this.repoService
          .fetchAllReposByUserName(user, 100, this.user.public_repos)
          .subscribe({
            next: (repoData) => {
              this.fetchedRepos = this.sortReposByStars([].concat(...repoData));
            },
            error: (error) => {
              this.errorStatus = error.status;
            },
            complete: () => {
              this.paginateRepos(0, 10);
              this.errorStatus = 0;
            },
          });
      },
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
    if (a.stargazers_count > b.stargazers_count) {
      return -1;
    }
    if (a.stargazers_count < b.stargazers_count) {
      return 1;
    }
    return 0;
  }

  getRouteParameter(): void {
    this.paginator.firstPage();
    this.route.paramMap.subscribe((params) => {
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

  goToGithubProfile(repoName: string): void {
    window.location.href = 'https://github.com/' + this.user.login + '/' + repoName;
  }
}
