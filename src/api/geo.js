import qs from 'querystringify';
import countries from './countries';

const OPEN_WEATHER_URI = 'http://api.openweathermap.org/data/2.5';
const OPEN_WEATHER_API_KEY = 'c6d4990b43e214e07ea5854d76feef3b';

export const getCountries = () => countries;

export const getCountryByCode = alpha2 => getCountries().find(country => country.alpha2 === alpha2);

/**
 * Get current position of the device.
 *
 * @param {boolean} enableHighAccuracy
 * @param {Number} timeout - amount of time in milliseconds before the error callback is invoked, if 0 it will never invoke.
 * @param {Number} maximumAge integer (milliseconds) | infinity - maximum cached position age.
 * Read more about params: https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
 *
 * @returns {Promise} promise which resolves with Position (https://developer.mozilla.org/en-US/docs/Web/API/Position) or rejects with an error
 */
export const getCurrentPosition = (enableHighAccuracy = false, timeout = Infinity, maximumAge = 600000) => {
    if (!navigator.geolocation) {
        return Promise.reject(new Error('Geolocation is not supported by this browser'));
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => resolve(position), err => reject(err), {
            enableHighAccuracy,
            timeout,
            maximumAge,
        });
    });
};

/**
 * Get weather forecast for one location
 *
 * @param city City name i.e. `London`, `Kaunas,LT`, etc.
 * @returns {Promise<any | never>}
 */
export const getCurrentWeatherForCity = city => {
    const params = {
        q: city,
        units: 'metric',
        lang: 'en',
        appid: OPEN_WEATHER_API_KEY,
    };

    return fetch(`${OPEN_WEATHER_URI}/weather?${qs.stringify(params)}`).then(res => res.json());
};

export const getCurrentWeatherByCoords = (lat, lon) => {
    const params = {
        lat,
        lon,
        units: 'metric',
        lang: 'en',
        appid: OPEN_WEATHER_API_KEY,
    };

    return fetch(`${OPEN_WEATHER_URI}/weather?${qs.stringify(params)}`).then(res => res.json());
};
