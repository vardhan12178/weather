import React from 'react';
import { WiLightning, WiSnow, WiRain, WiThermometer} from 'react-icons/wi';

const WeatherAlerts = ({ weatherData }) => {
  const getAlertDetails = (weather) => {
    const condition = weather.weather[0].main;
    const temp = weather.main.temp;

    switch (condition) {
      case 'Thunderstorm':
        return {
          message: "Severe Thunderstorm Alert!",
          icon: <WiLightning className="w-8 h-8 text-yellow-500" />,
          bgColor: "bg-yellow-100/50 dark:bg-yellow-900/20",
        };
      case 'Snow':
        return {
          message: "Snow Alert!",
          icon: <WiSnow className="w-8 h-8 text-blue-500" />,
          bgColor: "bg-blue-100/50 dark:bg-blue-900/20",
        };
      case 'Rain':
        return {
          message: "Rain Alert!",
          icon: <WiRain className="w-8 h-8 text-blue-500" />,
          bgColor: "bg-blue-100/50 dark:bg-blue-900/20",
        };
      case 'Clear':
        if (temp > 35) {
          return {
            message: "Extreme Heat Alert!",
            icon: <WiThermometer className="w-8 h-8 text-red-500" />,
            bgColor: "bg-red-100/50 dark:bg-red-900/20",
          };
        }
        break;
      case 'Haze':
        if (temp > 35) {
          return {
            message: "Extreme Heat Alert!",
            icon: <WiThermometer className="w-8 h-8 text-red-500" />,
            bgColor: "bg-red-100/50 dark:bg-red-900/20",
          };
        } else if (temp < 0) {
          return {
            message: "Extreme Cold Alert!",
            icon: <WiSnow className="w-8 h-8 text-blue-500" />,
            bgColor: "bg-blue-100/50 dark:bg-blue-900/20",
          };
        }
        break;
      default:
        return null;
    }
  };

  const alertDetails = getAlertDetails(weatherData);

  return (
    alertDetails && (
      <div className={`${alertDetails.bgColor} backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center justify-center space-x-4`}>
        {/* Alert Icon */}
        <div>{alertDetails.icon}</div>

        {/* Alert Message */}
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {alertDetails.message}
        </p>
      </div>
    )
  );
};

export default WeatherAlerts;