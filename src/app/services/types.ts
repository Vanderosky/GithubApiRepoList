export interface AllUserReposInfo {
    allRepos: Repo[];
}

export interface Repo {
    name: string;
    id: number;
    stars: number;
    forks: number;
    owner: Owner;
}

export interface Owner {
    login: string;
    id: number;
    avatar_url: string;
}
