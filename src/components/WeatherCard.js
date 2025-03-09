import React from 'react';
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) {
    return <div className="text-center">Loading...</div>;
  }

  const { name, weather, main, wind, dt } = weatherData;
  const { icon, description } = weather[0];
  const { temp, feels_like, humidity } = main;
  const { speed } = wind;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const iconClasses = "w-6 h-6 mr-2 text-blue-600 dark:text-yellow-200 transition-all duration-300";
  const cardClasses = "flex flex-col items-center bg-white/50 dark:bg-gray-700/20 rounded-lg p-3 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/30 transition-all duration-300";

  return (
    <section className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg p-6 text-center text-gray-800 dark:text-white border border-white/20 dark:border-gray-700/20 hover:shadow-md transition-all duration-300">
      {/* Location and Weather Icon */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {name}
      </h2>
      <img
        src={iconUrl}
        alt={description}
        className="mx-auto w-24 h-24 mb-4 transition-all duration-300 transform hover:scale-105"
      />

      {/* Weather Description */}
      <p className="text-lg sm:text-xl capitalize mb-4 text-gray-700 dark:text-gray-200 transition-all duration-300 transform hover:scale-105">
        {description}
      </p>

      {/* Temperature */}
      <p className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-yellow-200 mb-6 transition-all duration-300">
        {temp}<span className="text-2xl">°C</span>
      </p>

      {/* Additional Weather Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg">
        {/* RealFeel */}
        <div className={cardClasses} aria-label="RealFeel Temperature">
          <WiThermometer className={iconClasses} />
          <p className="font-semibold text-gray-800 dark:text-gray-200">RealFeel</p>
          <p className="text-gray-700 dark:text-gray-300">{feels_like}°C</p>
        </div>

        {/* Humidity */}
        <div className={cardClasses} aria-label="Humidity">
          <WiHumidity className={iconClasses} />
          <p className="font-semibold text-gray-800 dark:text-gray-200">Humidity</p>
          <p className="text-gray-700 dark:text-gray-300">{humidity}%</p>
        </div>

        {/* Wind Speed */}
        <div className={cardClasses} aria-label="Wind Speed">
          <WiStrongWind className={iconClasses} />
          <p className="font-semibold text-gray-800 dark:text-gray-200">Wind</p>
          <p className="text-gray-700 dark:text-gray-300">{speed} m/s</p>
        </div>
      </div>

      {/* Last Updated Timestamp */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        Last updated: {new Date(dt * 1000).toLocaleTimeString()}
      </p>
    </section>
  );
};

export default WeatherCard;