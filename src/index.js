"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_URL = "https://icanhazdadjoke.com/";
// Getting container where joke will be placed
let jokeContainer = document.querySelector('#jokeContainer');
// Variable jokeScores will be an JokeScore array
let jokeScores = [];
// Variable to save the joke obtained in previous http request. It will be used when score is provided
let currentJoke;
// Since headers are not dynamic for this case use we can define it just one time outside function
const headers = new Headers();
headers.append('Accept', 'application/json');
async function getJoke(url) {
    // Getting data from API 
    const jokeResponse = await fetch(url, { headers });
    // Returned value is an Response object we need to parse into javascript object
    const joke = await jokeResponse.json();
    currentJoke = joke;
    // Returning parsed object to resolve promise of async function
    return joke;
}
async function showJoke() {
    const joke = await getJoke(API_URL);
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
    // Displaying jokeScores array updated through console
    console.log(jokeScores);
    // Jumping into next joke to avoid scoring twice the same joke
    await showJoke();
}
