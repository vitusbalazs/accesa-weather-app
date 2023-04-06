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

router.post('/new', async (req, res) => {
    let cities = req.session.cities;
    let city = req.fields.cityName;
    console.log(city);
    let index = cities.findIndex(c => c.name === city);
    if (index === -1) {
        // If the city is not in the session, check if it's valid
        // Check if the city's data can be retrieved via the API
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);

            // If the city is valid, add it to the session
            cities.push({ name: response.data.name });

            req.session.cities = cities;
            res.redirect('/');
        } catch (error) {
            console.log("Invalid city");
            req.session.insertError = true;
            res.redirect('/');
        }
    } else {
        // If the city is already in the session, redirect to the home page
        res.redirect('/');
    }
});

router.post('/delete/:city', (req, res) => {
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
    let errorMsg = null;
    for (let city of cities) {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${WEATHER_API_KEY}&units=metric`);
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
    if (req.session.insertError || req.session.searchError) {
        req.session.insertError = false;
        req.session.searchError = false;
        errorMsg = "Invalid city";
    }

    res.render('index', { cities: cities, errorMsg })
});

export default router;