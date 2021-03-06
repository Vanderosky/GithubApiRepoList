export interface Repo {
  name: string;
  id: number;
  stargazers_count: number;
  forks: number;
  owner: Owner;
  updated_at: Date;
  open_issues_count: number;
  html_url: string;
}

export interface Owner {
  login: string;
  id: number;
  avatar_url: string;
}

export interface User {
  login: string;
  public_repos: number;
}
