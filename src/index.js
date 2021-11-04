"use strict";
// Loading env vars from .env file
Object.defineProperty(exports, "__esModule", { value: true });
// These values should be configured in external env file
const API_URL = 'https://icanhazdadjoke.com/';
const API_URL_NORRIS = 'https://api.chucknorris.io/jokes/random';
const OPENWEATHER_API_KEY = '0d739cccbf5a6a854c9ddf6b57c0857c';
// Getting container where joke will be placed
let jokeContainer = document.querySelector('#jokeContainer');
// Variable jokeScores will be an JokeScore array
let jokeScores = [];
// Variable to save the joke obtained in previous http request. It will be used when score is provided
let currentJoke;
// Since headers are not dynamic for this case use we can define it just one time outside function
const headers = new Headers();
headers.append('Accept', 'application/json');
// Setting weather info if Geolocation allowed by browser and user
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
}
async function getJoke() {
    const isCuckNorrisTime = Math.random() < 0.5;
    let jokeResponse;
    let joke;
    if (isCuckNorrisTime) {
        // Getting data from Chuck Norris API and forcing return object to JoseResponse type
        jokeResponse = await fetch(API_URL_NORRIS, { headers });
        // Since we don't know the exact content of the response and it can be change along the time (it's not our backend)
        // we can justify use any on this point
        const rawJoke = await jokeResponse.json();
        joke = {
            id: rawJoke.id,
            joke: rawJoke.value
        };
    }
    else {
        // Getting data from previous API 
        jokeResponse = await fetch(API_URL, { headers });
        // Returned value is an Response object we need to parse into javascript object
        joke = await jokeResponse.json();
    }
    currentJoke = joke;
    // Returning parsed object to resolve promise of async function
    return joke;
}
async function showJoke() {
    let joke;
    // We will get new joke if current is too long (for background style reasons)
    do {
        joke = await getJoke();
    } while (joke.joke.length > 250);
    if (jokeContainer) {
        jokeContainer.innerHTML = `"${joke.joke}"`;
        setRandomBg();
    }
}
async function setJokeScore(score) {
    // Guard clause to not run code with errors when the are any joke saved 
    // in currentJoke (before first click on button "Next joke") 
    if (!currentJoke) {
        return;
    }
    ;
    // Getting current datetime in ISO format
    const date = new Date();
    let dateISO = date.toISOString();
    // Adding info to jokeScores array
    jokeScores.push({
        joke: currentJoke.joke,
        score,
        date: dateISO
    });
    // Jumping into next joke to avoid scoring twice the same joke
    await showJoke();
}
async function getWeatherFromCoords(latitude, longitude) {
    const rawWeatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`);
    // We can use any there because response of this API is huge and we cannot parse all elements. Plus to that it's an external API that
    // we not are controlling so in the future can change some type of the attributes (or add/remove them) and break our custom type
    const weatherData = await rawWeatherData.json();
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
    };
}
async function success(pos) {
    const weatherData = await getWeatherFromCoords(pos.coords.latitude, pos.coords.longitude);
    // Getting DOM elements to render in Weather part
    let weatherContainer = document.querySelector('#weather');
    let weatherIcon = document.querySelector('img');
    let temperature = document.querySelector('#tempearature');
    // Guard clause
    if (!weatherContainer || !weatherIcon || !temperature) {
        return;
    }
    weatherIcon.setAttribute('src', `http://openweathermap.org/img/w/${weatherData.icon}.png`);
    weatherIcon.setAttribute('alt', `Icon of ${weatherData.main} weather`);
    temperature.innerHTML = weatherData.temperature.toString() + 'º';
}
;
function setRandomBg() {
    let mainContent = document.querySelector('main');
    let decorationTop = document.querySelector('#decorationTop');
    let decorationBottom = document.querySelector('#decorationBottom');
    if (!mainContent || !decorationTop || !decorationBottom) {
        return;
    }
    let randomNumbers = [];
    while (randomNumbers.length < 3) {
        const randomNumber = Math.floor(Math.random() * (6 - 1) + 1);
        if (!randomNumbers.includes(randomNumber)) {
            randomNumbers.push(randomNumber);
        }
    }
    mainContent.style.backgroundImage = `url(/src/assets/images/bg-${randomNumbers[0]}.svg)`;
    decorationTop.setAttribute('src', `/src/assets/images/bg-${randomNumbers[1]}.svg`);
    decorationBottom.setAttribute('src', `/src/assets/images/bg-${randomNumbers[2]}.svg`);
}
setRandomBg();
// Helper functions
function kelvinToCelsius(fahrenheit) {
    return parseFloat((fahrenheit - 273.15).toFixed(1));
}
