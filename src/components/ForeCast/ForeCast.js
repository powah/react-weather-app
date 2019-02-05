import React from 'react';
import PropTypes from 'prop-types';
import WindIcon from './WindIcon';
import WeatherIcon from './WeatherIcon';
import styles from './forecast.module.scss';

function ForeCast(props) {
    const { location, temperature, icon, description, cloudiness, humidity, pressure, windSpeed, windDeg } = props;
    return (
        <div className={styles.container}>
            <div className={styles.summary}>
                <div>
                    <WeatherIcon code={icon} className={styles.icon} />
                </div>
                <div className={styles.temperature}>{temperature} °C</div>
            </div>
            <div>
                <div className={styles.location}>{location}</div>
                <div className={styles.description}>{description}</div>

                <div className={styles.item}>
                    <div className={styles.label}>Wind: </div>
                    <div className={styles.value}>
                        <div className={styles.wind}>
                            <div className={styles.windSpeed}>{windSpeed} m/s</div>
                            <div>
                                <WindIcon width={20} deg={windDeg} className={styles.icon} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.item}>
                    <div className={styles.label}>Pressure: </div>
                    <div className={styles.value}>{pressure} hPa</div>
                </div>

                <div className={styles.item}>
                    <div className={styles.label}>Cloudiness: </div>
                    <div className={styles.value}>{cloudiness}%</div>
                </div>
                <div className={styles.item}>
                    <div className={styles.label}>Humidity: </div>
                    <div className={styles.value}>{humidity}%</div>
                </div>
            </div>
        </div>
    );
}

ForeCast.propTypes = {
    location: PropTypes.string.isRequired,
    temperature: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string,
    cloudiness: PropTypes.number,
    humidity: PropTypes.number,
    pressure: PropTypes.number,
    windSpeed: PropTypes.number,
    windDeg: PropTypes.number,
};

export default ForeCast;
