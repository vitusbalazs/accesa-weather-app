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

router.get('/:city', async (req, res) => {
    const city = req.params.city;
    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
    const forecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);

    const weather_data = {
        name: weather.data.name,
        temp: Math.round(weather.data.main.temp),
        temp_feels_like: Math.round(weather.data.main.feels_like),
        weather: convert_weather[weather.data.weather[0].main],
        weather2: weather.data.weather[0].main,
    }

    const forecast_data = {
        list: forecast.data.list.map((item) => {
            const now = new Date();
            const dateTime = new Date(item.dt_txt);
            const hours = dateTime.getHours(); // Get the hours component
            const minutes = dateTime.getMinutes(); // Get the minutes component
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            let date1 = now;
            let date2 = dateTime;
            date1.setHours(0, 0, 0, 0);
            date2.setHours(0, 0, 0, 0);
            const timeDiff = Math.abs(date2.getTime() - date1.getTime());
            const days_plus = Math.floor(timeDiff / (1000 * 3600 * 24));

            let weather_img = 'sad';
            if (convert_weather[item.weather[0].main] !== undefined) {
                weather_img = convert_weather[item.weather[0].main];
            }

            return {
                time: formattedTime,
                temp: Math.round(item.main.temp),
                weather: weather_img,
                weather_nice_format: item.weather[0].main,
                days_plus,
            }
        })
    }

    // remove every null from the array
    forecast_data.list = forecast_data.list.filter((item) => item !== null);

    res.render('details', { city, weather: weather_data, weather_forecast: forecast_data.list });
});

router.post('/', (req, res) => {
    const city = req.fields.cityName;
    res.redirect(`/details/${city}`);
});

export default router;