import { Router } from 'express';
import axios from 'axios';

const WEATHER_API_KEY = '923212afde733a2f1d8901f270f95ffe';

const router = Router();

const convert_weather = {
    ['Clouds']: 'cloudy',
    ['Clear']: 'sunny',
    ['Rain']: 'rainy',
    ['Snow']: 'snowy',
    ['Mist']: 'misty',
    ['Thunderstorm']: 'stormy',
    ['Drizzle']: 'rainy',
}

const convert_weather_from_code = {

}

router.get('/add', (req, res) => {
    req.session.cities = [
        { name: 'Salt Lake City' },
    ]
    res.redirect('/');
});

router.get('/remove', (req, res) => {
    req.session.cities = [];
    res.redirect('/');
});

router.get('/apicall', async (req, res) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Cluj-Napoca&appid=${WEATHER_API_KEY}&units=metric`);
    res.send(response.data);
});

router.post('/new', async (req, res) => {
    let cities = req.session.cities;
    let city = req.fields.cityName;
    console.log(city);
    let index = cities.findIndex(c => c.name === city);
    if (index === -1) {
        // Check if the city's data can be retrieved via the API
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);

            // If the city is valid, add it to the session
            cities.push({ name: city });

            req.session.cities = cities;
            res.redirect('/');
        } catch (error) {
            console.log("Invalid city");
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

router.post('/delete/:city', (req, res) => {
    console.log("Delete request received");
    let cities = req.session.cities;
    let city = req.params.city;
    let index = cities.findIndex(c => c.name === city);
    if (index !== -1) {
        cities.splice(index, 1);
    }
    req.session.cities = cities;
    res.redirect('/');
})

router.get('/', async (req, res) => {
    let cities = req.session.cities;
    for (let city of cities) {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${WEATHER_API_KEY}&units=metric`);
        // console.log(response.data);
        city.temp = Math.round(response.data.main.temp);
        city.temp_feels_like = Math.round(response.data.main.feels_like);
        if (convert_weather[response.data.weather[0].main] !== undefined) {
            city.weather = convert_weather[response.data.weather[0].main];
            city.weather2 = response.data.weather[0].main;
        } else {
            city.weather = 'sad';
            city.weather2 = response.data.weather[0].main;
        }
    }
    let currentLocationName = "Cluj-Napoca";
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${currentLocationName}&appid=${WEATHER_API_KEY}&units=metric`);
    let currentLocation = {
        name: currentLocationName,
        temp: Math.round(response.data.main.temp),
        temp_feels_like: Math.round(response.data.main.feels_like),
        weather: convert_weather[response.data.weather[0].main],
        weather2: response.data.weather[0].main,
    }
    res.render('index', { theme: req.session.theme, cities: cities })
});

export default router;