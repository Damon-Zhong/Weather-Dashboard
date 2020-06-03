const locationEl = document.querySelector("#Location");
const TemperatureEl = document.querySelector("#Temperature");
const WindSpeedEl = document.querySelector("#WindSpeed");
const HumidityEl = document.querySelector("#Humidity");
const UVEl = document.querySelector("#UV");
const historyEl = document.querySelector("#History");
let searchHistory = localStorage.searchHistory ? JSON.parse(localStorage.searchHistory) : [];

// Show the last search result
window.onload = fetchWeather( searchHistory[searchHistory.length-1] );

//Display user search history
function initialize(){
    historyEl.innerHTML = '';
    searchHistory.forEach(function(item){
        historyEl.innerHTML += `<li class="list-group-item" onclick="fetchWeather( '${item}' )">${item}</li>`
    })
}

//Get city name from input
function getCityName(){
    let cityName = document.querySelector("#searchBox").value;
    return cityName;
}
// Fetch weather data and display
async function fetchWeather( cityName ){
    //Complete api url with user input city name
    let apiForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=c6f6f0d5ef4d5464dfe745e65c596599`;
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=c6f6f0d5ef4d5464dfe745e65c596599`;
    //Retrieve data from api
    const weatherResult = await fetch( api ).then( (result)=>result.json() );
    const forecastResult = await fetch( apiForecast ).then( (result)=>result.json() );
    //Complete One Call url with returned results
    let apiOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherResult.coord.lat}&lon=${weatherResult.coord.lon}&appid=c6f6f0d5ef4d5464dfe745e65c596599`;
    const onecallResult = await fetch( apiOneCall ).then( (result)=>result.json() );
    //Display weather information
    if(weatherResult){
        displayWeather( weatherResult, forecastResult, onecallResult );
    }else{
        document.querySelector("#DisplayWindow").innerHTML = `<h2>City not found. Please try again.</h2>`;
    }
}
// Determine UV index background color to indicate risk of harm from unprotected Sun exposure
function UVIscale( uvi ){
    if( uvi<=5 ) return 'badge-success';
    if( uvi>5 && uvi<=7) return 'badge-warning';
    if( uvi>7 && uvi<=10) return 'badge-danger';
    if( uvi>10) return 'badge-dark';
}
function displayWeather(currentData, forecastData, onecallData){
    let currentDate = moment().format('M/D/YYYY');
    let scaleColor = UVIscale( `${onecallData.current.uvi}` )
    //Display current weather
    locationEl.innerHTML = `${currentData.name} (${currentDate}) <img src="http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" width="50" height="50">`;
    TemperatureEl.textContent = `Temperature: ${currentData.main.temp} ℃`;
    WindSpeedEl.textContent =  `Wind speed: ${currentData.wind.speed} MPH`;
    HumidityEl.textContent = `Humidity: ${currentData.main.humidity} %`;
    UVEl.innerHTML = `UV Index: <span class="badge ${scaleColor} )">${onecallData.current.uvi}</span> `
    //Display forecast weather
    document.querySelector("#Forecast").innerHTML = '';
    forecastData.list.forEach(displayForecast);
    //Save city name to local storage
    searchHistory.push(`${currentData.name}`);
    localStorage.searchHistory = JSON.stringify(searchHistory);
    initialize();
}

function displayForecast(item,index){
    if(index % 8 == 0 && index<40){
        let Date = moment().add(index/8+1,'days').format('M/D/YYYY');
        document.querySelector("#Forecast").innerHTML += 
        `<div class="card-body forecast">
            <h4>${Date}</h4>
            <p class="Temperature"><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" width="50" height="50"></p>
            <p class="Humidity">Temp: ${item.main.temp} ℃</p>
            <p class="WindSpeed">Humidity: ${item.main.humidity}%</p>
        </div>`
    }
}

function ClearHistory(){
    localStorage.clear();
    historyEl.innerHTML = '';
}

initialize();