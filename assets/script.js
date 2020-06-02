const locationEl = document.querySelector("#Location");
const TemperatureEl = document.querySelector("#Temperature");
const WindSpeedEl = document.querySelector("#WindSpeed");
const HumidityEl = document.querySelector("#Humidity");
const UVEl = document.querySelector("#UV");
const historyEl = document.querySelector("#History");
let searchHistory = localStorage.searchHistory ? JSON.parse(localStorage.searchHistory) : [];

//Display user search history
function initialize(){
    historyEl.innerHTML = '';
    searchHistory.forEach(function(item){
        historyEl.innerHTML += `<li class="list-group-item">${item}</li>`
        console.log(item);
    })

}

//Fetching weather based on search box input
async function fetchWeather( ){
    event.preventDefault();
    let cityName = document.querySelector("#searchBox").value;
    let currentDate = moment().format('M/D/YYYY');

    let api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=495dfed177b7e905cf8926b7461cc3b6`;
    const result = await fetch( api ).then( (result)=>result.json() );
    
    let apiOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${result.coord.lat}&lon=${result.coord.lon}&appid=495dfed177b7e905cf8926b7461cc3b6`;
    const onecallResult = await fetch( apiOneCall ).then( (result)=>result.json() );
    console.log(onecallResult);
 
    //If city name found, display weather info on screen; if city name not found, display error message
    if(result.name == cityName ){
        locationEl.innerHTML = `${result.name} (${currentDate}) <img src="http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png" width="50" height="50">`;
        TemperatureEl.textContent = `Temperature: ${result.main.temp} ℃`;
        WindSpeedEl.textContent =  `Wind speed: ${result.wind.speed} MPH`;
        HumidityEl.textContent = `Humidity: ${result.main.humidity} %`;
        UVEl.innerHTML = `UV Index: <span class="badge badge-primary ">${onecallResult.current.uvi}</span>`
    }else{
        document.querySelector("#DisplayWindow").innerHTML = `<h2>City not found. Please try again.</h2>`;
    }

    //Retrieve 5 days forecast info and display
    let apiForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=495dfed177b7e905cf8926b7461cc3b6`
    const forecast = await fetch( apiForecast ).then( (result)=>result.json() );
    document.querySelector("#Forecast").innerHTML = '';
    forecast.list.forEach(displayForecast);

    //Save search history to local storage
    searchHistory.push(cityName);
    localStorage.searchHistory = JSON.stringify(searchHistory);
    initialize();
}

function displayForecast(item,index){
    if(index % 8 == 0 && index<40){
        let Date = moment().add(index/8+1,'days').format('M/D/YYYY');
        console.log(index, Date)
        document.querySelector("#Forecast").innerHTML += 
        `<div class="card-body forecast">
            <h4>${Date}</h4>
            <p class="Temperature"><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" width="50" height="50"></p>
            <p class="Humidity">Temp: ${item.main.temp} ℃</p>
            <p class="WindSpeed">Humidity: ${item.main.humidity}%</p>
        </div>`
    }
}

function clearHistory(){
    localStorage.clear();
}

initialize();