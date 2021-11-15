// Loading env vars from .env file

import { JokeResponse, JokeScore, WeatherInfo } from './interfaces';

// These values should be configured in external env file
const API_URL:string = 'https://icanhazdadjoke.com/';
const API_URL_NORRIS: string = 'https://api.chucknorris.io/jokes/random';
const OPENWEATHER_API_KEY: string = '0d739cccbf5a6a854c9ddf6b57c0857c';

// Getting container where joke will be placed
const jokeContainer: HTMLElement | null = document.querySelector('#jokeContainer');

// Variable jokeScores will be an JokeScore array
const jokeScores: JokeScore[] = [];
// Variable to save the joke obtained in previous http request. It will be used when score is provided
let currentJoke: JokeResponse;

// Since headers are not dynamic for this case use we can define it just one time outside function
const headers: Headers = new Headers();
headers.append('Accept', 'application/json');

// Setting weather info if Geolocation allowed by browser and user
// else we will set Barcelona as default
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(setWeatherElements);
}
setWeatherElements({
  coords: {
    latitude: 41.390205, // Barcelona coords
    longitude: 2.154007,
    accuracy: 65,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: new Date().getTime()
});

async function getJoke (): Promise<JokeResponse> {
  const isCuckNorrisTime: boolean = Math.random() < 0.5;

  let jokeResponse: Response;
  let joke: JokeResponse;

  if (isCuckNorrisTime) {
    // Getting data from Chuck Norris API and forcing return object to JoseResponse type
    jokeResponse = await fetch(API_URL_NORRIS, { headers });
    // Since we don't know the exact content of the response and it can be change along the time (it's not our backend)
    // we can justify use any on this point
    const rawJoke: any = await jokeResponse.json();

    joke = {
      id: rawJoke.id,
      joke: rawJoke.value
    }
  } else {
    // Getting data from previous API
    jokeResponse = await fetch(API_URL, { headers });
    // Returned value is an Response object we need to parse into javascript object
    joke = await jokeResponse.json();
  }

  currentJoke = joke;
  // Returning parsed object to resolve promise of async function
  return joke;
}

async function showJoke (): Promise<void> {
  let joke: JokeResponse;
  // We will get new joke if current is too long (for background style reasons)
  do {
    joke = await getJoke()
  } while (joke.joke.length > 250);

  if (jokeContainer) {
    jokeContainer.innerHTML = `"${joke.joke}"`;
    setRandomBg();
  }
}

// eslint-disable-next-line no-unused-vars
async function setJokeScore (score: 1 | 2 | 3): Promise<void> {
  // Guard clause to not run code with errors when the are any joke saved
  // in currentJoke (before first click on button "Next joke")
  if (!currentJoke) { return };

  // Getting current datetime in ISO format
  const date: Date = new Date();
  const dateISO: string = date.toISOString();

  // Adding info to jokeScores array
  jokeScores.push({
    joke: currentJoke.joke,
    score, // We can use suggar syntax like this becuse key and varible has the same name
    date: dateISO
  })

  console.log(jokeScores);
  // Jumping into next joke to avoid scoring twice the same joke
  await showJoke();
}

async function getWeatherFromCoords (latitude: number, longitude: number): Promise<WeatherInfo> {
  const rawWeatherData: Response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`)
  // We can use any there because response of this API is huge and we cannot parse all elements. Plus to that it's an external API that
  // we not are controlling so in the future can change some type of the attributes (or add/remove them) and break our custom type
  const weatherData: any = await rawWeatherData.json();

  // Creating and returning an object of type WeatherInfo
  return {
    city: weatherData.name ?? '',
    country: weatherData.sys.country ?? '',
    main: weatherData.weather[0].main ?? '',
    icon: weatherData.weather[0].icon ?? '',
    description: weatherData.weather[0].description ?? '',
    // We must change from kelvin
    temperature: kelvinToCelsius(weatherData.main.temp),
    feelsLike: kelvinToCelsius(weatherData.main.feels_like),
    minTemp: kelvinToCelsius(weatherData.main.temp_min),
    maxTemp: kelvinToCelsius(weatherData.main.temp_max),
    humidity: weatherData.main.humidity
  }
}

// eslint-disable-next-line no-undef
async function setWeatherElements (pos: GeolocationPosition): Promise<void> {
  const weatherData = await getWeatherFromCoords(pos.coords.latitude, pos.coords.longitude);
  console.log(pos)
  // Getting DOM elements to render in Weather part
  const weatherContainer: HTMLElement | null = document.querySelector('#weather');
  const weatherIcon: HTMLElement | null = document.querySelector('img');
  const temperature: HTMLElement | null = document.querySelector('#tempearature');
  // Guard clause
  if (!weatherContainer || !weatherIcon || !temperature) {
    return;
  }

  weatherIcon.setAttribute('src', `http://openweathermap.org/img/w/${weatherData.icon}.png`);
  weatherIcon.setAttribute('alt', `Icon of ${weatherData.main} weather`);

  temperature.innerHTML = weatherData.temperature.toString() + 'º';
};

function setRandomBg (): void {
  const mainContent: HTMLElement | null = document.querySelector('main');
  const decorationTop: HTMLElement | null = document.querySelector('#decorationTop');
  const decorationBottom: HTMLElement | null = document.querySelector('#decorationBottom');

  if (!mainContent || !decorationTop || !decorationBottom) { return; }

  const randomNumbers: number[] = [];
  while (randomNumbers.length < 3) {
    const randomNumber: number = Math.floor(Math.random() * (6 - 1) + 1);
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber)
    }
  }

  mainContent.style.backgroundImage = `url(/src/assets/images/bg-${randomNumbers[0]}.svg)`;
  decorationTop.setAttribute('src', `/src/assets/images/bg-${randomNumbers[1]}.svg`);
  decorationBottom.setAttribute('src', `/src/assets/images/bg-${randomNumbers[2]}.svg`);
}
setRandomBg();

// Helper functions

function kelvinToCelsius (fahrenheit: number): number {
  return parseFloat((fahrenheit - 273.15).toFixed(1));
}
