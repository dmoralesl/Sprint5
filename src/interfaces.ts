
export interface JokeScore {
    joke: string;
    score: 1 | 2 | 3;
    date: string;
}

export interface JokeResponse {
    id: string;
    joke: string;
}
