export interface FullReposRespone {
    owner: Owner;
    repos: Repo[];
}

export interface Repo {
    name: string;
    id: number;
    stars: number;
    forks: number;
}

export interface Owner {
    name: string;
    id: number;
    avatar_url: string;
}
