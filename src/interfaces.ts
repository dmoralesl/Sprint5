export {
    JokeScore, 
    JokeResponse,
    WeatherInfo
};

interface JokeScore {
    joke: string;
    score: 1 | 2 | 3;
    date: string;
}

interface JokeResponse {
    id: string;
    joke: string;
}


interface WeatherInfo {
    city: string;
    country: string;
    main: string;
    description: string;
    temperature: number;
    feelsLike: number;
    minTemp: number;
    maxTemp: number;
    humidity: number;
}

