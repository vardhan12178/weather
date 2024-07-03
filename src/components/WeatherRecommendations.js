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

    const baseIconClass = "text-3xl";
    const lightModeIconClass = "text-purple-800";
    const darkModeIconClass = "dark:text-yellow-200";

    const iconClass = `${baseIconClass} ${lightModeIconClass} ${darkModeIconClass}`;

    if (condition === 'Rain') {
      return { message: "Don't forget your umbrella!", icon: <WiUmbrella className={iconClass} /> };
    }
    if (condition === 'Thunderstorm') {
      return { message: "Severe weather alert! Stay indoors and stay safe.", icon: <WiThunderstorm className={iconClass} /> };
    }
    if (condition === 'Snow') {
      return { message: "It's snowing! Wear warm clothes and drive safely.", icon: <WiSnow className={iconClass} /> };
    }
    if (condition === 'Clouds') {
      return { message: "It's cloudy. Perfect weather for a walk!", icon: <WiCloudy className={iconClass} /> };
    }

    if (temp > 30) {
      if (timeOfDay >= 18 || timeOfDay < 6) {
        return { message: "It's very hot outside. Try to stay cool indoors!", icon: <WiThermometer className={iconClass} /> };
      }
      return { message: "It's very hot outside. Stay hydrated and avoid direct sunlight!", icon: <WiThermometer className={iconClass} /> };
    }
    if (temp > 25) {
      if (timeOfDay >= 18 || timeOfDay < 6) {
        return { message: "It's warm outside. Enjoy the evening breeze!", icon: <WiDaySunny className={iconClass} /> };
      }
      return { message: "It's a great day for the beach!", icon: <WiDaySunny className={iconClass} /> };
    }
    if (temp < 0) {
      return { message: "It's freezing cold outside. Stay warm and consider indoor activities!", icon: <WiSnow className={iconClass} /> };
    }

    if (timeOfDay >= 18 || timeOfDay < 6) {
      return { message: "It's a nice night for a walk!", icon: <WiDaySunny className={iconClass} /> };
    }
    return { message: "It's a nice day for a walk!", icon: <WiDaySunny className={iconClass} /> };
  };

  const recommendation = getRecommendations(weatherData, timeOfDay);

  return (
    <div className="text-center p-2 mb-2">
      <div className="flex items-center justify-center">
        {recommendation.icon}
        <p className="text-md sm:text-lg ml-2 text-purple-900 dark:text-yellow-200">{recommendation.message}</p>
      </div>
    </div>
  );
};

export default WeatherRecommendations;
