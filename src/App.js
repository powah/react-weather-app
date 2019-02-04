import React, { Component } from 'react';
import CountriesSelect from './components/CountriesSelect';
import * as GeoApi from './api/geo';
import cn from 'classnames';
import styles from './App.module.scss';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latitude: null,
            longitude: null,
            countries: GeoApi.getCountries().map(country => ({
                label: country.name,
                value: country.alpha2,
            })),
            country: null,
            city: '',
            error: '',
            msg: 'Please fill the form to get forecast for the location',
            forecast: null,
        };
    }

    componentDidMount() {
        this.requestLocation();
    }

    requestLocation = () =>
        GeoApi.getCurrentPosition()
            .then(({ coords }) => {
                const { latitude, longitude } = coords;
                GeoApi.getCurrentWeatherByCoords(latitude, longitude).then(forecast => {
                    this.setState({ latitude, longitude, forecast });
                });
            })
            .catch(err => console.error(err));

    handleCountry = country => this.setState({ country, error: '', msg: 'Now enter a city name' });

    handleCity = e => this.setState({ city: e.target.value });

    handleSearchSubmit = e => {
        e.preventDefault();
        const { country, city } = this.state;
        if (!country) {
            return this.setState({ error: 'Please select your country' });
        }
        if (!city) {
            return this.setState({ error: 'Please enter city name' });
        }

        this.setState({ error: '', msg: 'Preparing your forecast data. Please wait...' });
        GeoApi.getCurrentWeatherForCity(city + ',' + country.value).then(forecast =>
            this.setState({ forecast, msg: 'It`s ready!' }),
        );
    };

    renderMsg = () => {
        const { error, msg } = this.state;
        if (error) {
            return <p className={cn(styles.msg, styles.err)}>{error}</p>;
        }
        if (msg) {
            return <p className={styles.msg}>{msg}</p>;
        }

        return null;
    };

    render() {
        const { countries, country, city } = this.state;

        return (
            <div className={styles.App}>
                <header className={styles.header}>
                    <h1>Weather forecast</h1>
                </header>
                <main role="main" className={styles.content}>
                    {this.renderMsg()}

                    <form onSubmit={this.handleSearchSubmit} className={styles.form}>
                        <CountriesSelect onSelect={this.handleCountry} items={countries} className={styles.formItem} />
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={this.handleCity}
                            disabled={!country}
                            className={styles.formItem}
                        />
                        <input type="submit" value="Search" className={styles.formItem} />
                    </form>
                </main>
                <footer className={styles.footer}>&copy; No rights reserverd :)</footer>
            </div>
        );
    }
}

export default App;
