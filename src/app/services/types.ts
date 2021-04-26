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

export interface User {
    login: string;
    public_repos: number;
}
