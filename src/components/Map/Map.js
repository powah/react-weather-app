import React from 'react';
import PropTypes from 'prop-types';
import load from 'little-loader';
import { getCurrentWeatherByBoundingBox } from '../../api/geo';

class Map extends React.Component {
    ref = React.createRef();
    isRequestInProgress = false;

    componentDidMount() {
        load('https://maps.googleapis.com/maps/api/js', this.initMap, this);
    }

    componentWillUnmount() {
        const google = window.google;
        if (this.map) {
            google.maps.event.clearInstanceListeners(this.map);
        }
    }

    initMap = () => {
        const { lat, lng } = this.props;
        const google = window.google;
        const map = (this.map = new google.maps.Map(this.ref.current, {
            zoom: 10,
            center: new google.maps.LatLng(lat, lng),
        }));
        const infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(map, 'idle', () => {
            if (this.isRequestInProgress) {
                return;
            }

            this.isRequestInProgress = true;
            const bounds = map.getBounds();
            const NE = bounds.getNorthEast();
            const SW = bounds.getSouthWest();

            getCurrentWeatherByBoundingBox(NE.lat(), NE.lng(), SW.lat(), SW.lng(), map.getZoom())
                .then(results => {
                    this.isRequestInProgress = false;
                    const { list } = results;
                    if (!list || !list.length) {
                        return;
                    }

                    // clear data layer
                    map.data.forEach(feature => map.data.remove(feature));

                    // add data layer
                    map.data.addGeoJson({
                        type: 'FeatureCollection',
                        features: list.map(feature => toGeoJson(feature, map)),
                    });
                })
                .catch(err => {
                    this.isRequestInProgress = false;
                    console.warn(err);
                });
        });

        // Sets up and populates the info window with details
        map.data.addListener('click', function(event) {
            const icon = event.feature.getProperty('icon');
            const city = event.feature.getProperty('city');
            const temperature = event.feature.getProperty('temperature');
            const weather = event.feature.getProperty('weather');
            infoWindow.setContent(`
                <img src=${icon} /><br />
                <strong>${city}</strong><br />
                ${temperature}&deg;C<br />
                ${weather}
            `);
            infoWindow.setOptions({
                position: {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                },
                pixelOffset: {
                    width: 0,
                    height: -15,
                },
            });
            infoWindow.open(map);
        });

        // For each result that comes back, convert the data to geoJSON
        function toGeoJson(weatherItem, map) {
            const feature = {
                type: 'Feature',
                properties: {
                    city: weatherItem.name,
                    weather: weatherItem.weather[0].main,
                    temperature: weatherItem.main.temp,
                    min: weatherItem.main.temp_min,
                    max: weatherItem.main.temp_max,
                    humidity: weatherItem.main.humidity,
                    pressure: weatherItem.main.pressure,
                    windSpeed: weatherItem.wind.speed,
                    windDegrees: weatherItem.wind.deg,
                    windGust: weatherItem.wind.gust,
                    icon: `http://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png`,
                    coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat],
                },
                geometry: {
                    type: 'Point',
                    coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat],
                },
            };
            // Set the custom marker icon
            map.data.setStyle(function(feature) {
                return {
                    icon: {
                        url: feature.getProperty('icon'),
                        anchor: new google.maps.Point(25, 25),
                    },
                };
            });
            // returns object
            return feature;
        }
    };

    render() {
        return <div ref={this.ref} className={this.props.className} />;
    }
}

Map.propTypes = {
    className: PropTypes.string,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
};

export default Map;
