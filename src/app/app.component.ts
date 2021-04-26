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

  constructor() { }

  ngOnInit(): void {
  }

}
