// src/components/WeatherAlerts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { WiLightning, WiSnow, WiRain, WiThermometer, WiStrongWind } from 'react-icons/wi';

const WeatherAlerts = ({ location, coordinates }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [isVisible, setIsVisible] = useState(() => {
    const savedState = localStorage.getItem('weatherAlertDismissed');
    return savedState ? JSON.parse(savedState).isVisible : true;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setError('');
        setLoading(true);
        let url = '';

        if (coordinates.lat && coordinates.lon) {
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`;
        } else if (location) {
          url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`;
        }

        if (url) {
          const response = await axios.get(url);
          setWeatherData(response.data);
        }
      } catch (err) {
        setError('Unable to fetch weather data for alerts.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, coordinates]);

  useEffect(() => {
    localStorage.setItem('weatherAlertDismissed', JSON.stringify({ isVisible }));
  }, [isVisible]);

  const getFrostbiteRisk = (windChill) => {
    // Approximate frostbite risk based on wind chill (in Celsius)
    if (windChill > -15) return null; // No significant risk
    if (windChill > -28) return "Risk of frostbite in 30 minutes";
    if (windChill > -35) return "Risk of frostbite in 10 minutes";
    return "Risk of frostbite in 5 minutes";
  };

  const getAlertDetails = (weather) => {
    const { main, weather: weatherDetails, wind } = weather;
    const { temp, humidity } = main;
    const condition = weatherDetails[0].main;
    const { speed: windSpeed } = wind;

    const windChill =
      temp <= 10 && windSpeed > 4.8 / 3.6
        ? 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed * 3.6, 0.16) + 0.3965 * temp * Math.pow(windSpeed * 3.6, 0.16)
        : temp;

    const heatIndex =
      temp >= 27
        ? temp + 0.33 * (humidity / 100) * 6.105 * Math.exp(17.27 * temp / (237.7 + temp)) - 4.25
        : temp;

    const weatherInfo = `Current Temp: ${temp.toFixed(1)}°C | Humidity: ${humidity}% | Wind: ${windSpeed.toFixed(1)} m/s`;

    if (heatIndex >= 40) {
      return {
        message: "Extreme Heat Alert!",
        details: `Heat Index: ${heatIndex.toFixed(1)}°C. Stay hydrated and avoid outdoor activities. ${weatherInfo}`,
        icon: <WiThermometer />,
        severity: 'severe',
      };
    }
    if (windChill <= 0) {
      const frostbiteRisk = getFrostbiteRisk(windChill);
      return {
        message: "Extreme Cold Alert!",
        details: `Wind Chill: ${windChill.toFixed(1)}°C. ${frostbiteRisk ? `${frostbiteRisk}—` : ''}bundle up and limit exposure. ${weatherInfo}`,
        icon: <WiSnow />,
        severity: 'severe',
      };
    }
    if (condition === 'Thunderstorm') {
      return {
        message: "Severe Thunderstorm Alert!",
        details: `Stay indoors and avoid open areas. ${weatherInfo}`,
        icon: <WiLightning />,
        severity: 'severe',
      };
    }
    if (condition === 'Rain') {
      if (windSpeed > 10) {
        return {
          message: "Heavy Rain and Wind Alert!",
          details: `Stay indoors and secure loose objects. ${weatherInfo}`,
          icon: <WiRain />,
          severity: 'moderate',
        };
      } else {
        return {
          message: "Rain Alert!",
          details: `Light to moderate rain expected. Consider indoor activities. ${weatherInfo}`,
          icon: <WiRain />,
          severity: 'moderate',
        };
      }
    }
    if (windSpeed > 20) {
      return {
        message: "High Wind Alert!",
        details: `Secure outdoor objects and avoid travel. ${weatherInfo}`,
        icon: <WiStrongWind />,
        severity: 'moderate',
      };
    }
    return null;
  };

  if (loading) return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-gray-600 dark:text-gray-300 drop-shadow-sm">Loading alerts...</p>
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

  if (!weatherData || !weatherData.main || !weatherData.weather) return (
    <div className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center justify-center border border-gray-200/50 dark:border-gray-700/50">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-poppins drop-shadow-sm">No weather data available.</p>
    </div>
  );

  const alertDetails = getAlertDetails(weatherData);

  if (!alertDetails || !isVisible) return null; // Return null if there are no alerts

  const severityColor = alertDetails.severity === 'severe' ? 'text-red-600 dark:text-red-300' : 'text-yellow-600 dark:text-yellow-200';
  const severityHoverColor = alertDetails.severity === 'severe' ? 'hover:text-red-700 dark:hover:text-red-400' : 'hover:text-yellow-700 dark:hover:text-yellow-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 text-center text-gray-800 dark:text-white border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 ${severityColor} ${severityHoverColor} transition-colors drop-shadow-md`}>
          {alertDetails.icon}
        </div>
        <div className="text-left">
          <p className={`text-lg font-semibold ${severityColor} font-poppins drop-shadow-sm`}>
            <span className="font-bold">Alert:</span> {alertDetails.message}
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm">
            {alertDetails.details}
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

export default WeatherAlerts;