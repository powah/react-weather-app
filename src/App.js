import React, { Component } from 'react';
import * as GeoApi from './api/geo';
import SearchForm from './components/SearchForm';
import ForeCast from './components/ForeCast';
import Map from './components/Map';
import styles from './App.module.scss';

class App extends Component {
    state = {
        latitude: null,
        longitude: null,
        forecast: null,
    };

    componentDidMount() {
        this.requestLocation();
    }

    requestLocation = () =>
        GeoApi.getCurrentPosition()
            .then(({ coords }) => {
                const { latitude, longitude } = coords;
                GeoApi.getCurrentWeatherByCoords(latitude, longitude).then(forecast =>
                    this.setState({ latitude, longitude, forecast: mapForecastToProps(forecast) }),
                );
            })
            .catch(err => console.error(err));

    onSubmit = (country, city) =>
        GeoApi.getCurrentWeatherForCity(city + ',' + country.value).then(forecast =>
            this.setState({
                latitude: forecast.coord.lat,
                longitude: forecast.coord.lng,
                forecast: mapForecastToProps(forecast),
            }),
        );

    render() {
        const { forecast, latitude, longitude } = this.state;

        return (
            <div className={styles.App}>
                <header className={styles.header}>
                    <h1>Weather forecast</h1>
                </header>
                <main role="main" className={styles.content}>
                    <div className={styles.contentBody}>
                        <SearchForm onSubmit={this.onSubmit} />
                        {forecast && <ForeCast {...forecast} />}
                    </div>
                    {latitude && longitude && <Map lat={latitude} lng={longitude} className={styles.map} />}
                </main>
                <footer className={styles.footer}>&copy; No rights reserved :)</footer>
            </div>
        );
    }
}

const mapForecastToProps = forecast => {
    if (!forecast) {
        return null;
    }
    const { clouds, main, weather, wind, name } = forecast;
    return {
        location: name,
        temperature: main && main.temp,
        icon: weather && String(weather[0].id),
        description: weather && weather[0].description,
        cloudiness: clouds && clouds.all,
        humidity: main && main.humidity,
        pressure: main && main.pressure,
        windSpeed: wind && wind.speed,
        windDeg: wind && wind.deg,
    };
};

export default App;
