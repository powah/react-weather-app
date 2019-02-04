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

    render() {
        const { country } = this.state;

        return (
            <div className={styles.App}>
                <header className={styles.header}>
                    <h1>Weather forecast</h1>
                </header>
                <main role="main">
                    <CountriesSelect onSelect={this.setCountry} />
                    <input type="text" placeholder="City" disabled={!country} />
                    <button onClick={this.requestLocation}>Use my location</button>
                </main>
            </div>
        );
    }
}

export default App;
