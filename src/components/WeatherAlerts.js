import React from 'react';
import { WiLightning, WiSnow, WiRain, WiThermometer, WiStrongWind } from 'react-icons/wi';

const WeatherAlerts = ({ weatherData }) => {
  const getAlertDetails = (weather) => {
    const { main, weather: weatherDetails, wind } = weather;
    const condition = weatherDetails[0].main;
    const temp = main.temp;
    const windSpeed = wind.speed;

    if (temp >= 40) {
      return {
        message: "Extreme Heat Alert! Stay hydrated and avoid outdoor activities.",
        icon: <WiThermometer className="w-8 h-8 text-red-500" />,
        bgColor: "bg-red-100/50 dark:bg-red-900/20",
      };
    }
    if (temp <= 0) {
      return {
        message: "Extreme Cold Alert! Bundle up and stay warm.",
        icon: <WiSnow className="w-8 h-8 text-blue-500" />,
        bgColor: "bg-blue-100/50 dark:bg-blue-900/20",
      };
    }
    if (condition === 'Thunderstorm') {
      return {
        message: "Severe Thunderstorm Alert! Stay indoors and avoid open areas.",
        icon: <WiLightning className="w-8 h-8 text-yellow-500" />,
        bgColor: "bg-yellow-100/50 dark:bg-yellow-900/20",
      };
    }
    if (condition === 'Rain' && windSpeed > 10) {
      return {
        message: "Heavy Rain and Wind Alert! Stay indoors and secure loose objects.",
        icon: <WiRain className="w-8 h-8 text-blue-500" />,
        bgColor: "bg-blue-100/50 dark:bg-blue-900/20",
      };
    }
    if (windSpeed > 20) {
      return {
        message: "High Wind Alert! Secure outdoor objects and avoid travel.",
        icon: <WiStrongWind className="w-8 h-8 text-gray-500" />,
        bgColor: "bg-gray-100/50 dark:bg-gray-900/20",
      };
    }
    return null;
  };

  const alertDetails = getAlertDetails(weatherData);

  if (!alertDetails) return null;

  return (
    <div className={`${alertDetails.bgColor} backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center justify-center space-x-4`}>
      <div>{alertDetails.icon}</div>
      <p className="text-lg font-semibold text-gray-900 dark:text-white">
        {alertDetails.message}
      </p>
    </div>
  );
};

export default WeatherAlerts;