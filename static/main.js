let showingFavorite = false;
let showingSearch = false;
let showingBlackBlur = false;

function moveFloatingWindow(floatingWindowId) {
    document.getElementById('black-blur').style.display = (showingFavorite || showingSearch) ? "none" : "block";
    if (floatingWindowId === "add-new-favorite") {
        showingFavorite = !showingFavorite;
        document.getElementById('black-blur').style.display = (showingFavorite || showingSearch) ? "block" : "none";
        document.getElementById('add-new-favorite').style.bottom = showingFavorite ? "50%" : "100%";
        // Now give the transform translateY
        // document.getElementById('add-new-favorite').style.transform = showingFavorite ? "none" : "translateY(-50%)";
    } else if (floatingWindowId === 'search-city') {
        showingSearch = !showingSearch;
        document.getElementById('black-blur').style.display = (showingFavorite || showingSearch) ? "block" : "none";
        document.getElementById('search-city').style.bottom = showingSearch ? "50%" : "100%";
    }
}

function moveErrorWindow() {
    document.getElementById('error-black-blur').style.display = "none";
    document.getElementById('error-window').style.bottom = "100%";
}

const WEATHER_API_KEY = '923212afde733a2f1d8901f270f95ffe';

const convert_weather = {
    ['Clouds']: 'cloudy',
    ['Clear']: 'sunny',
    ['Rain']: 'rainy',
    ['Snow']: 'snowy',
    ['Mist']: 'misty',
    ['Thunderstorm']: 'stormy',
    ['Drizzle']: 'rainy',
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showCurrentWeather);
} else {
    console.log("Geolocation is not supported by this browser.");
}

function showCurrentWeather(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log(data.name);

        const inspectDiv = document.createElement('div');
        const inspectAnchor = document.createElement('a');
        const inspectIcon = document.createElement('i');

        inspectIcon.classList.add('fas');
        inspectIcon.classList.add('fa-eye');

        inspectAnchor.href = `/details/${data.name}`;
        inspectAnchor.appendChild(inspectIcon);

        inspectDiv.classList.add('remove-favorite');
        inspectDiv.appendChild(inspectAnchor);

        document.getElementById('current-weather').insertBefore(inspectDiv, document.getElementById('current-weather').firstChild);

        document.getElementById('hide-on-pos').style.display = "none";
        document.getElementById('current-image').src = `assets/${convert_weather[data.weather[0].main]}.png`;
        document.getElementById('current-title').innerText = data.name;
        document.getElementById('weather-type').innerText = data.weather[0].main;
        document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}<sup>o</sup>C (feels like ${Math.round(data.main.feels_like)}<sup>o</sup>C)`;
        
    })
    .catch(error => {
        console.log(error);
    })
}





/* <div class="remove-favorite">
    <a href="/<%= current.name %>"><i class="fas fa-eye"></i></a>
</div>
*/