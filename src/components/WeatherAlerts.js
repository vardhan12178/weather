import React, { useState } from 'react';
import { WiLightning, WiSnow, WiRain, WiThermometer, WiStrongWind } from 'react-icons/wi';

const WeatherAlerts = ({ weatherData }) => {
  const [isVisible, setIsVisible] = useState(true);

  const getAlertDetails = (weather) => {
    const { main, weather: weatherDetails, wind } = weather;
    const { temp } = main;
    const condition = weatherDetails[0].main;
    const { speed: windSpeed } = wind;

    if (temp >= 40) {
      return {
        message: "Extreme Heat Alert! Stay hydrated and avoid outdoor activities.",
        icon: <WiThermometer className="w-10 h-10 text-red-500 hover:text-red-600 transition-colors" />,
        bgColor: "bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20",
      };
    }
    if (temp <= 0) {
      return {
        message: "Extreme Cold Alert! Bundle up and stay warm.",
        icon: <WiSnow className="w-10 h-10 text-blue-500 hover:text-blue-600 transition-colors" />,
        bgColor: "bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20",
      };
    }
    if (condition === 'Thunderstorm') {
      return {
        message: "Severe Thunderstorm Alert! Stay indoors and avoid open areas.",
        icon: <WiLightning className="w-10 h-10 text-yellow-500 hover:text-yellow-600 transition-colors" />,
        bgColor: "bg-gradient-to-r from-yellow-100/50 to-amber-100/50 dark:from-yellow-900/20 dark:to-amber-900/20",
      };
    }
    if (condition === 'Rain' && windSpeed > 10) {
      return {
        message: "Heavy Rain and Wind Alert! Stay indoors and secure loose objects.",
        icon: <WiRain className="w-10 h-10 text-blue-500 hover:text-blue-600 transition-colors" />,
        bgColor: "bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20",
      };
    }
    if (windSpeed > 20) {
      return {
        message: "High Wind Alert! Secure outdoor objects and avoid travel.",
        icon: <WiStrongWind className="w-10 h-10 text-gray-500 hover:text-gray-600 transition-colors" />,
        bgColor: "bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-900/20 dark:to-gray-800/20",
      };
    }
    return null;
  };

  if (!weatherData || !weatherData.main || !weatherData.weather) return (
    <div className="bg-gray-100/50 dark:bg-gray-800/20 backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center justify-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">No weather data available.</p>
    </div>
  );

  const alertDetails = getAlertDetails(weatherData);

  if (!alertDetails || !isVisible) return null;

  return (
    <div className={`${alertDetails.bgColor} backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center space-x-4`}>
      <div className="flex items-center space-x-4">
        <div>{alertDetails.icon}</div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white text-center">
          <span className="font-bold">Alert:</span> {alertDetails.message}
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default WeatherAlerts;