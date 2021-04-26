import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RepositoriesService } from 'src/app/services/repositories.service';
import { Repo, User } from 'src/app/services/types';

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

  repos: Repo[] = [];
  reposCount = 0;

  constructor(private repoService: RepositoriesService) { }

  userFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
  }

  fetchReposData(user: string): void {
    this.repoService.fetchUser(user).subscribe({
      next: userInfo => {
        this.reposCount = userInfo.public_repos;
      },
      error: error => { },
      complete: () => {
        this.repoService.fetchAllReposByUserName(user, 60, this.reposCount).subscribe({
          next: repoData => {
            this.repos = this.sortReposByStars([].concat(...repoData));
          },
          error: error => { },
          complete: () => { }
        });
      }
    });
  }

  sortReposByStars(repos: Repo[]): Repo[] {
    return repos.sort(this.compareStars);
  }

  compareStars( a: Repo, b: Repo): number {
    if ( a.stargazers_count < b.stargazers_count ){
      return -1;
    }
    if ( a.stargazers_count > b.stargazers_count ){
      return 1;
    }
    return 0;
  }
}
