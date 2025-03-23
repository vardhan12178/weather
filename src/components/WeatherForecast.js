// src/components/WeatherForecast.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

// Utility function to convert wind direction (degrees) to cardinal direction
const getWindDirection = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

const WeatherForecast = ({ location, coordinates, start, end, hoverEffect }) => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState({});

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setError('');
        setLoading(true);
        let url = '';

        if (coordinates.lat && coordinates.lon) {
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`;
        } else if (location) {
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`;
        }

        if (url) {
          const response = await axios.get(url);
          setForecastData(response.data.list.filter((_, index) => index % 8 === 0).slice(start, end));
        }
      } catch (err) {
        setError('Unable to fetch weather forecast.');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [location, coordinates, start, end]);

  const toggleTooltip = (key) => {
    setShowTooltip((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (loading) return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-gray-600 dark:text-gray-300 drop-shadow-sm">Loading forecast...</p>
    </div>
  );

  if (error) return (
    <div className="text-center bg-red-100 bg-opacity-10 dark:bg-red-900 dark:bg-opacity-30 p-4 rounded-lg">
      <p className="text-red-500 dark:text-red-300 drop-shadow-sm">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  if (!forecastData.length) return (
    <div className="text-center">
      <p className="text-gray-500 dark:text-gray-400 drop-shadow-sm">No forecast data available.</p>
    </div>
  );

  const containerClasses = `bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 text-center text-gray-800 dark:text-white border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-row flex-wrap justify-center gap-6">
        {forecastData.map((day, index) => {
          const { dt_txt, weather, main, wind, pop } = day;
          const { description, icon, main: condition } = weather[0];
          const { temp, feels_like, humidity } = main;
          const windDirection = getWindDirection(wind.deg);

          return (
            <motion.div
              key={dt_txt}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex flex-col items-center justify-center group relative ${
                hoverEffect ? 'transform hover:scale-105 transition-all duration-300' : ''
              }`}
              onClick={() => toggleTooltip(dt_txt)}
            >
              {/* Date */}
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 font-poppins drop-shadow-sm">
                {formatDate(dt_txt)}
              </p>

              {/* Weather Icon */}
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
                className="w-16 h-16 my-2 drop-shadow-md"
              />

              {/* Weather Condition Label */}
              <p className="text-sm text-gray-600 dark:text-gray-300 capitalize font-poppins drop-shadow-sm">
                {condition === 'Clear' ? (icon.includes('d') ? 'Sunny' : 'Clear Night') : condition}
              </p>

              {/* Temperature */}
              <p className="text-2xl font-bold text-blue-600 dark:text-yellow-200 font-poppins mt-2 drop-shadow-md">
                {temp.toFixed(1)}°C
              </p>

              {/* Humidity */}
              <p className="text-sm text-gray-600 dark:text-gray-300 font-poppins drop-shadow-sm">
                Humidity: {humidity}%
              </p>

              {/* Precipitation Chance */}
              <p className="text-sm text-gray-600 dark:text-gray-300 font-poppins drop-shadow-sm">
                Rain: {Math.round(pop * 100)}%
              </p>

              {/* Tooltip for Feels Like, Wind Speed, and Wind Direction */}
              <span
                className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none sm:group-hover:opacity-100 sm:opacity-0 ${
                  showTooltip[dt_txt] ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Feels like: {feels_like.toFixed(1)}°C | Wind: {wind.speed} m/s {windDirection}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;