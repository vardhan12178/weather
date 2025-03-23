// src/components/WeatherCard.js
import React, { useState } from 'react';
import { WiThermometer, WiHumidity, WiStrongWind, WiSunrise, WiSunset, WiBarometer, WiHorizon } from 'react-icons/wi';
import { motion } from 'framer-motion';
import { RefreshCw } from 'react-feather';

const WeatherCard = ({ weatherData, setCoordinates, opacityClass = 'bg-opacity-10' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState({});

  if (!weatherData) {
    return <div className="text-center">Loading...</div>;
  }

  const { name, weather, main, wind, sys, dt, coord, visibility } = weatherData;
  const { main: description, icon } = weather[0];
  const { temp, feels_like, humidity, pressure } = main;
  const { speed: wind_speed } = wind;
  const { sunrise, sunset } = sys;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCoordinates({ lat: coord.lat, lon: coord.lon });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleTooltip = (key) => {
    setShowTooltip((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const iconClasses = "w-6 h-6 mr-2 text-blue-600 dark:text-yellow-200 transition-all duration-300 drop-shadow-md";
  const detailCardClasses = `flex items-center justify-center bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-3 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-300 group relative border border-gray-200/50 dark:border-gray-700/50`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isRefreshing ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-white ${opacityClass} dark:bg-gray-800 dark:${opacityClass} backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 text-center text-gray-800 dark:text-white border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300`}
    >
      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/90 dark:bg-gray-700/90 hover:bg-gray-200/90 dark:hover:bg-gray-600/90 transition-colors"
        aria-label="Refresh weather data"
      >
        <RefreshCw
          size={20}
          className={`text-gray-600 dark:text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`}
        />
      </button>

      {/* Location */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-poppins drop-shadow-md">
        {name || 'Unknown Location'}
      </h2>

      {/* Weather Icon */}
      <motion.img
        src={iconUrl}
        alt={description}
        className="mx-auto w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mb-4 drop-shadow-md"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Weather Description */}
      <p className="text-lg sm:text-xl lg:text-2xl capitalize mb-4 text-gray-700 dark:text-gray-200 font-poppins drop-shadow-md">
        {description}
      </p>

      {/* Temperature */}
      <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 dark:text-yellow-200 mb-6 font-poppins drop-shadow-md">
        {temp.toFixed(1)}<span className="text-2xl sm:text-3xl lg:text-4xl">°C</span>
      </p>

      {/* Additional Weather Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg">
        {/* RealFeel */}
        <div
          className={detailCardClasses}
          aria-label="RealFeel Temperature"
          onClick={() => toggleTooltip('realfeel')}
        >
          <WiThermometer className={iconClasses} />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm">RealFeel</p>
            <p className="text-gray-700 dark:text-gray-300 drop-shadow-sm">{feels_like.toFixed(1)}°C</p>
          </div>
          <span
            className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none sm:group-hover:opacity-100 sm:opacity-0 ${
              showTooltip['realfeel'] ? 'opacity-100' : 'opacity-0'
            }`}
          >
            How the temperature feels
          </span>
        </div>

        {/* Humidity */}
        <div
          className={detailCardClasses}
          aria-label="Humidity"
          onClick={() => toggleTooltip('humidity')}
        >
          <WiHumidity className={iconClasses} />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm">Humidity</p>
            <p className="text-gray-700 dark:text-gray-300 drop-shadow-sm">{humidity}%</p>
          </div>
          <span
            className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none sm:group-hover:opacity-100 sm:opacity-0 ${
              showTooltip['humidity'] ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Moisture in the air
          </span>
        </div>

        {/* Wind Speed */}
        <div
          className={detailCardClasses}
          aria-label="Wind Speed"
          onClick={() => toggleTooltip('wind')}
        >
          <WiStrongWind className={iconClasses} />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm">Wind</p>
            <p className="text-gray-700 dark:text-gray-300 drop-shadow-sm">{wind_speed.toFixed(1)} m/s</p>
          </div>
          <span
            className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none sm:group-hover:opacity-100 sm:opacity-0 ${
              showTooltip['wind'] ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Wind speed
          </span>
        </div>
      </div>

      {/* Collapsible Additional Details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 text-blue-600 dark:text-yellow-200 hover:underline font-poppins drop-shadow-sm"
      >
        {isExpanded ? 'Hide Details' : 'Show More Details'}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg"
        >
          {/* Sunrise */}
          <div className={detailCardClasses} aria-label="Sunrise Time">
            <WiSunrise className={iconClasses} />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm">Sunrise</p>
              <p className="text-gray-700 dark:text-gray-300 drop-shadow-sm">
                {new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Sunset */}
          <div className={detailCardClasses} aria-label="Sunset Time">
            <WiSunset className={iconClasses} />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm">Sunset</p>
              <p className="text-gray-700 dark:text-gray-300 drop-shadow-sm">
                {new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Pressure */}
          <div
            className={detailCardClasses}
            aria-label="Pressure"
            onClick={() => toggleTooltip('pressure')}
          >
            <WiBarometer className={iconClasses} />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm">Pressure</p>
              <p className="text-gray-700 dark:text-gray-300 drop-shadow-sm">{pressure} hPa</p>
            </div>
            <span
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none sm:group-hover:opacity-100 sm:opacity-0 ${
                showTooltip['pressure'] ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Atmospheric pressure
            </span>
          </div>

          {/* Visibility */}
          <div
            className={detailCardClasses}
            aria-label="Visibility"
            onClick={() => toggleTooltip('visibility')}
          >
            <WiHorizon className={iconClasses} />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm">Visibility</p>
              <p className="text-gray-700 dark:text-gray-300 drop-shadow-sm">{(visibility / 1000).toFixed(1)} km</p>
            </div>
            <span
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none sm:group-hover:opacity-100 sm:opacity-0 ${
                showTooltip['visibility'] ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Distance you can see
            </span>
          </div>
        </motion.div>
      )}

      {/* Last Updated Timestamp */}
      <p className="text-sm text-gray-800 dark:text-gray-200 mt-4 font-poppins bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-full px-3 py-1 inline-block drop-shadow-sm">
        Last updated: {new Date(dt * 1000).toLocaleTimeString()}
      </p>
    </motion.section>
  );
};

export default WeatherCard;