import { Component, OnInit } from '@angular/core';
import { RepositoriesService } from './services/repositories.service';
import { Repo } from './services/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GithubApiRepoList';

  repos: Repo[] = [];

  constructor(private repoService: RepositoriesService) { }

  ngOnInit(): void {
    this.fetchReposData();
  }

  fetchReposData(): void {
    this.repoService.fetchReposByUserName('octocat').subscribe({
      next: repoData => {
        this.repos = repoData;
      },
      error: error => { },
      complete: () => { }
    });
  }

}
