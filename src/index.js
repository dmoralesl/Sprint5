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
async function getJoke() {
    const isCuckNorrisTime = Math.random() < 0.5;
    let jokeResponse;
    let joke;
    if (isCuckNorrisTime) {
        // Getting data from Chuck Norris API and forcing return object to JoseResponse type
        jokeResponse = await fetch(API_URL_NORRIS, { headers });
        console.log(typeof jokeResponse);
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
    const joke = await getJoke();
    if (jokeContainer) {
        jokeContainer.innerHTML = `"${joke.joke}"`;
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
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
}
async function getWeatherFromCoords(latitude, longitude) {
    const rawWeatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`);
    const weatherData = await rawWeatherData.json();
    // Creating and returning an object of type WeatherInfo
    return {
        city: weatherData.name ?? '',
        country: weatherData.sys.country ?? '',
        main: weatherData.weather[0].main ?? '',
        description: weatherData.weather[0].description ?? '',
        // We must change from fahrenheit to celsius
        temperature: kelvinToCelsius(weatherData.main.temp),
        feelsLike: kelvinToCelsius(weatherData.main.feels_like),
        minTemp: kelvinToCelsius(weatherData.main.temp_min),
        maxTemp: kelvinToCelsius(weatherData.main.temp_max),
        humidity: weatherData.main.humidity
    };
}
async function success(pos) {
    var crd = pos.coords;
    const weatherData = await getWeatherFromCoords(crd.latitude, crd.longitude);
    // Creating elements of DOM to render in Weather part
    let weatherContainer = document.querySelector('#weather');
    if (!weatherContainer) {
        return;
    }
    // Location and main weather
    let headerWeather = document.createElement('div');
    headerWeather.style.display = "flex";
    headerWeather.style.alignItems = "center";
    headerWeather.style.gap = ".3rem";
    let location = document.createElement('div');
    let city = document.createElement('span');
    city.innerHTML = weatherData.city;
    let country = document.createElement('span');
    country.innerHTML = ` (${weatherData.country})`;
    location.appendChild(city);
    location.appendChild(country);
    headerWeather.appendChild(location);
    const delimiter = document.createTextNode('|');
    headerWeather.append(delimiter);
    const mainWeather = document.createElement('span');
    mainWeather.innerHTML = weatherData.main;
    mainWeather.style.fontSize = 'larger';
    headerWeather.appendChild(mainWeather);
    weatherContainer.appendChild(headerWeather);
    // Temperatures (current, max and min)
    let temperatures = document.createElement('div');
    temperatures.style.display = 'flex';
    temperatures.style.justifyContent = 'center';
    temperatures.style.alignItems = 'center';
    temperatures.style.gap = '.5rem';
    let currentTemp = document.createElement('span');
    currentTemp.style.fontSize = "1.5rem";
    currentTemp.innerHTML = weatherData.temperature.toString() + 'º';
    let rangeTemps = document.createElement('div');
    let minTemp = document.createElement('span');
    minTemp.style.color = 'blue';
    minTemp.innerHTML = weatherData.minTemp.toString() + 'º';
    let maxTemp = document.createElement('span');
    maxTemp.style.color = 'red';
    maxTemp.innerHTML = weatherData.maxTemp.toString() + 'º';
    temperatures.appendChild(minTemp);
    temperatures.appendChild(currentTemp);
    temperatures.appendChild(maxTemp);
    weatherContainer.appendChild(temperatures);
}
;
// Helper functions
function kelvinToCelsius(fahrenheit) {
    return parseFloat((fahrenheit - 273.15).toFixed(1));
}
