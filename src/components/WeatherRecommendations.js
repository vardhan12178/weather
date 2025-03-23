// src/components/WeatherRecommendations.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { WiDaySunny, WiMoonAltWaxingCrescent3 } from 'react-icons/wi';

// Utility function to convert wind direction (degrees) to cardinal direction
const getWindDirection = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

const WeatherRecommendations = ({ location, coordinates }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState(null);
  const [isVisible, setIsVisible] = useState(() => {
    const savedState = localStorage.getItem('weatherRecommendationDismissed');
    return savedState ? JSON.parse(savedState).isVisible : true;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorVisible, setErrorVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setError('');
        setErrorVisible(true);
        setLoading(true);
        let url = '';

        if (coordinates.lat && coordinates.lon) {
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`;
        } else if (location) {
          url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`;
        }

        if (url) {
          const response = await axios.get(url);
          setCurrentWeather(response.data);

          const timezoneOffsetSeconds = response.data.timezone;
          const utcTime = new Date();
          const localTime = new Date(utcTime.getTime() + timezoneOffsetSeconds * 1000);
          setTimeOfDay(localTime.getUTCHours());
        }
      } catch (err) {
        setError('Unable to fetch weather data for recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, coordinates]);

  useEffect(() => {
    localStorage.setItem('weatherRecommendationDismissed', JSON.stringify({ isVisible }));
  }, [isVisible]);

  const getRecommendation = (weather, timeOfDay) => {
    const { main, weather: weatherDetails, wind } = weather;
    const { temp, humidity, feels_like } = main;
    const condition = weatherDetails[0].main;
    const { speed: windSpeed, deg: windDeg } = wind;

    const heatIndex =
      temp >= 27
        ? temp + 0.33 * (humidity / 100) * 6.105 * Math.exp(17.27 * temp / (237.7 + temp)) - 4.25
        : temp;
    const windChill =
      temp <= 10 && windSpeed > 4.8
        ? 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed * 3.6, 0.16) + 0.3965 * temp * Math.pow(windSpeed * 3.6, 0.16)
        : temp;

    // Suppress recommendation for any rain condition
    if (
      heatIndex >= 40 ||
      windChill <= 0 ||
      condition === 'Thunderstorm' ||
      condition === 'Rain' || // Changed to suppress for any rain
      windSpeed > 20
    ) {
      return null;
    }

    const weatherInfo = `Temp: ${temp.toFixed(1)}°C, Humidity: ${humidity}%, Wind: ${windSpeed.toFixed(1)} m/s`;
    const tooltipDetails = {
      feelsLike: feels_like.toFixed(1),
      windDirection: getWindDirection(windDeg),
    };

    if (timeOfDay >= 18 || timeOfDay < 6) {
      if (temp > 20 && temp < 30 && windSpeed < 5) {
        return {
          message: `It's a peaceful night. Perfect for a walk under the moonlight! ${weatherInfo}`,
          icon: <WiMoonAltWaxingCrescent3 className="w-8 h-8 text-blue-600 dark:text-yellow-200 drop-shadow-md" />,
          tooltip: tooltipDetails,
        };
      } else if (temp < 15) {
        return {
          message: `It's a cool night. A light jacket would be perfect for a stroll! ${weatherInfo}`,
          icon: <WiMoonAltWaxingCrescent3 className="w-8 h-8 text-blue-600 dark:text-yellow-200 drop-shadow-md" />,
          tooltip: tooltipDetails,
        };
      } else {
        return {
          message: `It's a pleasant night. Enjoy a relaxing evening outdoors! ${weatherInfo}`,
          icon: <WiMoonAltWaxingCrescent3 className="w-8 h-8 text-blue-600 dark:text-yellow-200 drop-shadow-md" />,
          tooltip: tooltipDetails,
        };
      }
    } else if (timeOfDay >= 12 && timeOfDay < 18) {
      if (temp > 25 && humidity < 60) {
        return {
          message: `It's a pleasant afternoon. Great time for outdoor activities! ${weatherInfo}`,
          icon: <WiDaySunny className="w-8 h-8 text-blue-600 dark:text-yellow-200 drop-shadow-md" />,
          tooltip: tooltipDetails,
        };
      } else if (humidity > 80) {
        return {
          message: `It's a humid afternoon. Stay hydrated if you're heading out! ${weatherInfo}`,
          icon: <WiDaySunny className="w-8 h-8 text-blue-600 dark:text-yellow-200 drop-shadow-md" />,
          tooltip: tooltipDetails,
        };
      } else {
        return {
          message: `It's a nice afternoon. Enjoy some time outdoors! ${weatherInfo}`,
          icon: <WiDaySunny className="w-8 h-8 text-blue-600 dark:text-yellow-200 drop-shadow-md" />,
          tooltip: tooltipDetails,
        };
      }
    } else {
      if (temp > 20 && temp < 30 && condition === 'Clear') {
        return {
          message: `It's a beautiful morning. Start your day with a refreshing walk! ${weatherInfo}`,
          icon: <WiDaySunny className="w-8 h-8 text-blue-600 dark:text-yellow-200 drop-shadow-md" />,
          tooltip: tooltipDetails,
        };
      } else if (temp < 20) {
        return {
          message: `It's a cool morning. A brisk walk will warm you up! ${weatherInfo}`,
          icon: <WiDaySunny className="w-8 h-8 text-blue-600 dark:text-yellow-200 drop-shadow-md" />,
          tooltip: tooltipDetails,
        };
      } else {
        return {
          message: `It's a pleasant morning. Enjoy the fresh air! ${weatherInfo}`,
          icon: <WiDaySunny className="w-8 h-8 text-blue-600 dark:text-yellow-200 drop-shadow-md" />,
          tooltip: tooltipDetails,
        };
      }
    }
  };

  if (loading) return (
    <div className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center justify-center border border-gray-200/50 dark:border-gray-700/50">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error && errorVisible) return (
    <div className="bg-red-100 bg-opacity-10 dark:bg-red-900 dark:bg-opacity-30 backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center justify-between border border-gray-200/50 dark:border-gray-700/50">
      <p className="text-sm text-red-500 dark:text-red-300 font-poppins drop-shadow-sm">{error}</p>
      <button
        onClick={() => setErrorVisible(false)}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  if (!currentWeather || !currentWeather.coord) return (
    <div className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center justify-center border border-gray-200/50 dark:border-gray-700/50">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-poppins drop-shadow-sm">No weather data available.</p>
    </div>
  );

  const recommendation = getRecommendation(currentWeather, timeOfDay);

  if (!recommendation || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 text-center text-gray-800 dark:text-white border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 flex items-center justify-between group relative"
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{recommendation.icon}</div>
        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm">{recommendation.message}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
        }}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <span
        className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none sm:group-hover:opacity-100 sm:opacity-0 ${
          showTooltip ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Feels like: {recommendation.tooltip.feelsLike}°C | Wind Direction: {recommendation.tooltip.windDirection}
      </span>
    </motion.div>
  );
};

export default WeatherRecommendations;