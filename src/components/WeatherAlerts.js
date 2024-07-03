import React from 'react';
import { WiThunderstorm, WiSnow, WiUmbrella, WiThermometer } from 'react-icons/wi';

const WeatherAlerts = ({ weatherData }) => {
  const showAlert = (weather) => {
    const condition = weather.weather[0].main;

    switch (condition) {
      case 'Thunderstorm':
        return "⚠️ Severe Thunderstorm Alert!";
      case 'Snow':
        return "❄️ Snow Alert!";
      case 'Rain':
        return "☔️ Rain Alert!";
      case 'Clear':
        if (weather.main.temp > 35) {
          return "🔥 Extreme Heat Alert!";
        }
        break;
      case 'Haze':
        if (weather.main.temp > 35) {
          return "🔥 Extreme Heat Alert!";
        } else if (weather.main.temp < 0) {
          return "🥶 Extreme Cold Alert!";
        }
        break;
      default:
        return null;
    }
  };

  const alertMessage = showAlert(weatherData);

  return (
    alertMessage && (
      <div className="text-center p-4 mb-4">
        <p className="text-red-600 dark:text-red-800 text-lg font-bold">{alertMessage}</p>
      </div>
    )
  );
};

export default WeatherAlerts;
