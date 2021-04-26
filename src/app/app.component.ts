import { Component, OnInit } from '@angular/core';
import { RepositoriesService } from './services/repositories.service';
import { Repo, User } from './services/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GithubApiRepoList';

  repos: Repo[] = [];
  user: User = {
    login: '',
    public_repos: 0
  };
  constructor(private repoService: RepositoriesService) { }

  ngOnInit(): void {
    this.fetchReposData();
    this.fetchUser();
  }

  fetchReposData(): void {
    this.repoService.fetchReposByUserName('microsoft').subscribe({
      next: repoData => {
        this.repos = repoData;
      },
      error: error => { },
      complete: () => { }
    });
  }

  fetchUser(): void {
    this.repoService.fetchUser('microsoft').subscribe({
      next: userInfo => {
        this.user = userInfo;
      },
      error: error => { },
      complete: () => { }
    });
  }

}
