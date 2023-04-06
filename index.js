import express from 'express';
import session from 'express-session';
import eformidable from 'express-formidable';
import path from 'path';
import morgan from 'morgan';

import rootRouter from './routes/root.js';
import detailsRouter from './routes/details.js';

const staticDir = path.join(process.cwd(), 'static');

const WEATHER_API_KEY = '923212afde733a2f1d8901f270f95ffe';
const cityName = 'Salt Lake City'

const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(eformidable());

app.use(session({
    secret: "vitus-balazs-weather-app",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    }
}));

// Middleware that sets the default options for the session
app.get('/', (req, res, next) => {
    if (req.session.cities === undefined) {
        req.session.cities = [];
    }
    if (req.session.insertError === undefined) {
        req.session.insertError = false;
    }
    if (req.session.searchError === undefined) {
        req.session.searchError = false;
    }
    next();
})

app.use('/details', detailsRouter);

app.use('/', rootRouter);

app.use(express.static(staticDir));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});





// const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WEATHER_API_KEY}`);
        // res.send(response.data);