import React, { Component } from 'react';
import * as GeoApi from './api/geo';
import { storageAvailable } from './utils/storage';
import SearchForm from './components/SearchForm';
import ForeCast from './components/ForeCast';
import Map from './components/Map';
import styles from './App.module.scss';

const isStorageAvailable = storageAvailable('localStorage');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            forecast: null,
            favorite: null,
            favorites: this.getFavorites(),
        };
    }

    componentDidMount() {
        this.requestLocation();
    }

    getFavorites = () => {
        if (!isStorageAvailable) {
            return [];
        }

        try {
            return JSON.parse(localStorage.getItem('favorites')) || [];
        } catch (e) {
            console.warn(e);
        }

        return [];
    };

    saveToFavorites = e => {
        e.preventDefault();
        const { favorites, city, country, forecast } = this.state;
        const newFavorites = [...favorites, { id: forecast.id, country, city }];
        this.setState({ favorites: newFavorites });
        try {
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
        } catch (e) {
            console.warn(e);
        }
    };

    showSaveToFavorites = () => {
        if (!isStorageAvailable) {
            return false;
        }
        const { favorites, forecast } = this.state;
        return forecast ? forecast && !favorites.find(fav => fav.id === forecast.id) : false;
    };

    handleFavoriteSearch = e => {
        const favorite = e.target.value;
        this.setState({ favorite });
        GeoApi.getCurrentWeatherForId(favorite)
            .then(forecast => this.setState(mapForecastToState(forecast)))
            .catch(err => console.error(err));
    };

    requestLocation = () =>
        GeoApi.getCurrentPosition()
            .then(({ coords }) => {
                const { latitude, longitude } = coords;
                GeoApi.getCurrentWeatherByCoords(latitude, longitude).then(forecast =>
                    this.setState(mapForecastToState(forecast)),
                );
            })
            .catch(err => console.error(err));

    onSubmit = (country, city) =>
        GeoApi.getCurrentWeatherForCity(city + ',' + country.value).then(forecast =>
            this.setState(mapForecastToState(forecast)),
        );

    render() {
        const { forecast, latitude, longitude, favorites, favorite } = this.state;

        return (
            <div className={styles.App}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1>Weather forecast</h1>
                        {favorites && favorites.length > 0 && (
                            <form>
                                <select onChange={this.handleFavoriteSearch} value={favorite ? favorite : ''}>
                                    {favorites.map(({ id, country, city }) => (
                                        <option key={id} value={id}>
                                            {city + ', ' + country.value}
                                        </option>
                                    ))}
                                </select>
                            </form>
                        )}
                    </div>
                </header>
                <main role="main" className={styles.content}>
                    <div className={styles.contentBody}>
                        <SearchForm onSubmit={this.onSubmit} />
                        {forecast && (
                            <ForeCast
                                {...forecast}
                                onLocationSave={this.showSaveToFavorites() ? this.saveToFavorites : undefined}
                            />
                        )}
                    </div>
                    <Map lat={latitude} lng={longitude} className={styles.map} />
                </main>
                <footer className={styles.footer}>&copy; No rights reserved :)</footer>
            </div>
        );
    }
}

const mapForecastToState = forecast => {
    if (!forecast) {
        return {};
    }

    const { id, clouds, main, weather, wind, name, coord, sys } = forecast;
    const countryByCode = GeoApi.getCountryByCode(sys.country);
    return {
        latitude: coord.lat,
        longitude: coord.lon,
        city: name,
        country: countryByCode
            ? {
                  label: countryByCode.name,
                  value: countryByCode.alpha2,
              }
            : null,
        forecast: {
            id,
            location: name,
            temperature: main && main.temp,
            icon: weather && String(weather[0].id),
            description: weather && weather[0].description,
            cloudiness: clouds && clouds.all,
            humidity: main && main.humidity,
            pressure: main && main.pressure,
            windSpeed: wind && wind.speed,
            windDeg: wind && wind.deg,
        },
    };
};

export default App;
