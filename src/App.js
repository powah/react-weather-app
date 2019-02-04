import React, { Component } from 'react';
import CountriesSelect from './components/CountriesSelect';
import { getCurrentPosition, getCurrentWeatherForCity } from './api/geo';
import styles from './App.module.scss';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latitude: null,
            longitude: null,
            country: null,
            city: '',
            msg: '',
        };
    }

    componentDidMount() {
        this.requestLocation();

        getCurrentWeatherForCity('Kaunas,LT').then(data => console.log(data));
    }

    setCountry = country => this.setState({ country });

    requestLocation = () =>
        getCurrentPosition()
            .then(({ coords }) => {
                const { latitude, longitude } = coords;
                console.log('coords', coords);
                this.setState({ latitude, longitude });
            })
            .catch(err => console.error(err));

    handleSearchSubmit = e => {
        e.preventDefault();
        const { country, city } = this.state;
        if (!country) {
            return this.setState({ msg: 'Please select country'});
        }
        if (!city) {
            return this.setState({ msg: 'Please enter city name'});
        }
    };

    render() {
        const { country, msg } = this.state;

        return (
            <div className={styles.App}>
                <header className={styles.header}>
                    <h1>Weather forecast</h1>
                </header>
                <main role="main">
                    <p>{msg ? msg : 'Please fill the form to get forecase for the location'}</p>

                    <form onSubmit={this.handleSearchSubmit} className={styles.form}>
                        <CountriesSelect onSelect={this.setCountry} />
                        <input type="text" placeholder="City" disabled={!country} />
                        <input type="submit" value="Search" />
                    </form>
                    <button onClick={this.requestLocation}>Use my location</button>
                </main>
            </div>
        );
    }
}

export default App;
