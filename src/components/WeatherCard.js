import React from 'react';
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';

const WeatherCard = ({ weatherData }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  const iconClasses = "w-6 h-6 mr-2 text-blue-600 dark:text-yellow-200 transition-all duration-300";

  return (
    <div className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg p-6 text-center text-gray-800 dark:text-white border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300">
      {/* Location and Weather Icon */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {weatherData.name}
      </h2>
      <img
        src={iconUrl}
        alt={weatherData.weather[0].description}
        className="mx-auto w-24 h-24 mb-4 transition-all duration-300 transform hover:scale-110"
      />

      {/* Weather Description */}
      <p className="text-lg sm:text-xl capitalize mb-4 text-gray-700 dark:text-gray-200 transition-all duration-300 transform hover:scale-105">
        {weatherData.weather[0].description}
      </p>

      {/* Temperature */}
      <p className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-yellow-200 mb-6 transition-all duration-300">
        {weatherData.main.temp}°C
      </p>

      {/* Additional Weather Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg">
        {/* RealFeel */}
        <div className="flex flex-col items-center bg-white/50 dark:bg-gray-700/20 rounded-lg p-3 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/30 transition-all duration-300">
          <WiThermometer className={iconClasses} />
          <p className="font-semibold text-gray-800 dark:text-gray-200">RealFeel</p>
          <p className="text-gray-700 dark:text-gray-300">{weatherData.main.feels_like}°C</p>
        </div>

        {/* Humidity */}
        <div className="flex flex-col items-center bg-white/50 dark:bg-gray-700/20 rounded-lg p-3 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/30 transition-all duration-300">
          <WiHumidity className={iconClasses} />
          <p className="font-semibold text-gray-800 dark:text-gray-200">Humidity</p>
          <p className="text-gray-700 dark:text-gray-300">{weatherData.main.humidity}%</p>
        </div>

        {/* Wind Speed */}
        <div className="flex flex-col items-center bg-white/50 dark:bg-gray-700/20 rounded-lg p-3 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/30 transition-all duration-300">
          <WiStrongWind className={iconClasses} />
          <p className="font-semibold text-gray-800 dark:text-gray-200">Wind</p>
          <p className="text-gray-700 dark:text-gray-300">{weatherData.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;