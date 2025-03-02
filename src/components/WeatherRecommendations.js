import React, { useEffect, useState } from 'react';
import { WiDaySunny, WiSnow, WiCloudy, WiThunderstorm, WiThermometer, WiUmbrella } from 'react-icons/wi';
import getTimeAtLocation from './getTimeAtLocation';

const WeatherRecommendations = ({ weatherData }) => {
  const [timeOfDay, setTimeOfDay] = useState(null);
  const timezoneApiKey = '9WIGB6WMZB3M';

  useEffect(() => {
    const fetchTimeOfDay = async () => {
      try {
        const { lat, lon } = weatherData.coord;
        const response = await getTimeAtLocation(lat, lon, timezoneApiKey);
        if (response) {
          const currentTime = new Date(response.timestamp * 1000);
          setTimeOfDay(currentTime.getHours());
        }
      } catch (error) {
        console.error('Error fetching time of day:', error);
      }
    };

    fetchTimeOfDay();
  }, [weatherData]);

  const getRecommendations = (weather, timeOfDay) => {
    const { main, weather: weatherDetails } = weather;
    const condition = weatherDetails[0].main;
    const temp = main.temp;

    const recommendations = [];

    // Weather condition-based recommendations
    if (condition === 'Rain') {
      recommendations.push({
        message: "Don't forget your umbrella! It's raining outside.",
        icon: <WiUmbrella className="w-8 h-8 text-blue-500 dark:text-blue-300" />,
        bgColor: "bg-blue-100/50 dark:bg-blue-900/20",
      });
    }
    if (condition === 'Thunderstorm') {
      recommendations.push({
        message: "Severe weather alert! Stay indoors and stay safe.",
        icon: <WiThunderstorm className="w-8 h-8 text-purple-500 dark:text-purple-300" />,
        bgColor: "bg-purple-100/50 dark:bg-purple-900/20",
      });
    }
    if (condition === 'Snow') {
      recommendations.push({
        message: "It's snowing! Wear warm clothes and drive safely.",
        icon: <WiSnow className="w-8 h-8 text-blue-300 dark:text-blue-200" />,
        bgColor: "bg-blue-100/50 dark:bg-blue-900/20",
      });
    }
    if (condition === 'Clouds') {
      recommendations.push({
        message: "It's cloudy. Perfect weather for a walk!",
        icon: <WiCloudy className="w-8 h-8 text-gray-500 dark:text-gray-300" />,
        bgColor: "bg-gray-100/50 dark:bg-gray-900/20",
      });
    }

    // Temperature-based recommendations
    if (temp > 30) {
      recommendations.push({
        message: "It's very hot outside. Stay hydrated and avoid direct sunlight!",
        icon: <WiThermometer className="w-8 h-8 text-red-500 dark:text-red-300" />,
        bgColor: "bg-red-100/50 dark:bg-red-900/20",
      });
    } else if (temp > 25) {
      recommendations.push({
        message: "It's warm outside. Enjoy the sunshine!",
        icon: <WiDaySunny className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />,
        bgColor: "bg-yellow-100/50 dark:bg-yellow-900/20",
      });
    } else if (temp < 0) {
      recommendations.push({
        message: "It's freezing cold outside. Bundle up and stay warm!",
        icon: <WiSnow className="w-8 h-8 text-blue-300 dark:text-blue-200" />,
        bgColor: "bg-blue-100/50 dark:bg-blue-900/20",
      });
    }

    // Time-based recommendations (only if no extreme conditions)
    if (temp >= 0 && temp <= 25) {
      if (timeOfDay >= 18 || timeOfDay < 6) {
        recommendations.push({
          message: "It's a nice night for a walk under the stars!",
          icon: <WiDaySunny className="w-8 h-8 text-indigo-500 dark:text-indigo-300" />,
          bgColor: "bg-indigo-100/50 dark:bg-indigo-900/20",
        });
      } else {
        recommendations.push({
          message: "It's a great day for outdoor activities!",
          icon: <WiDaySunny className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />,
          bgColor: "bg-yellow-100/50 dark:bg-yellow-900/20",
        });
      }
    }

    return recommendations;
  };

  const recommendations = getRecommendations(weatherData, timeOfDay);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {recommendations.map((rec, index) => (
        <div
          key={index}
          className={`${rec.bgColor} backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">{rec.icon}</div>
            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200">{rec.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherRecommendations;