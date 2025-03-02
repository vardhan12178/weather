import React, { useEffect, useState } from 'react';
import { WiDaySunny, WiMoonAltWaxingCrescent3 } from 'react-icons/wi';
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
          const currentTime = new Date(response.formatted);
          setTimeOfDay(currentTime.getHours());
        }
      } catch (error) {
        console.error('Error fetching time of day:', error);
      }
    };

    fetchTimeOfDay();
  }, [weatherData]);

  const getRecommendation = (weather, timeOfDay) => {
    const { main, weather: weatherDetails } = weather;
    const condition = weatherDetails[0].main;
    const temp = main.temp;

    // Extreme conditions: No recommendation, only alerts
    if (temp >= 40 || temp <= 0 || condition === 'Thunderstorm' || condition === 'Rain' || condition === 'Snow') {
      return null;
    }

    // Time-based recommendations
    if (timeOfDay >= 18 || timeOfDay < 6) {
      return {
        message: "It's a peaceful night. Perfect for a walk under the moonlight!",
        icon: <WiMoonAltWaxingCrescent3 className="w-8 h-8 text-indigo-500 dark:text-indigo-300" />,
        bgColor: "bg-indigo-100/50 dark:bg-indigo-900/20",
      };
    } else if (timeOfDay >= 12 && timeOfDay < 18) {
      return {
        message: "It's a pleasant afternoon. Great time for outdoor activities!",
        icon: <WiDaySunny className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />,
        bgColor: "bg-yellow-100/50 dark:bg-yellow-900/20",
      };
    } else {
      return {
        message: "It's a beautiful morning. Start your day with a refreshing walk!",
        icon: <WiDaySunny className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />,
        bgColor: "bg-yellow-100/50 dark:bg-yellow-900/20",
      };
    }
  };

  const recommendation = getRecommendation(weatherData, timeOfDay);

  if (!recommendation) return null;

  return (
    <div className={`${recommendation.bgColor} backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center min-h-[90px]`}>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{recommendation.icon}</div>
        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 text-center">{recommendation.message}</p>
      </div>
    </div>
  );
};

export default WeatherRecommendations;