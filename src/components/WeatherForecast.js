import { useEffect, useState } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';

const WeatherForecast = ({ location, coordinates, start, end, hoverEffect }) => {
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setError('');
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
      }
    };

    fetchForecast();
  }, [location, coordinates, start, end]);

  const renderIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <WiDaySunny className="text-yellow-300 w-8 h-8 mx-auto" />;
      case 'Clouds':
        return <WiCloudy className="text-gray-300 w-8 h-8 mx-auto" />;
      case 'Rain':
        return <WiRain className="text-blue-300 w-8 h-8 mx-auto" />;
      case 'Snow':
        return <WiSnow className="text-white w-8 h-8 mx-auto" />;
      default:
        return <WiDaySunny className="text-yellow-300 w-8 h-8 mx-auto" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className={`flex-grow bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-700 p-3 rounded-xl shadow-lg text-center text-white ${hoverEffect ? 'transform hover:scale-105 transition-transform duration-300 ease-in-out hover:bg-opacity-80' : ''}`}>
      {error && <p className="text-red-600 text-center">{error}</p>}
      {forecastData.map((day, index) => (
        <div key={index} className="mb-4">
          <p className="text-md sm:text-lg font-semibold">{formatDate(day.dt_txt)}</p>
          <div className="flex justify-center">
            {renderIcon(day.weather[0].main)}
          </div>
          <p className="text-md sm:text-lg">{day.weather[0].description}</p>
          <p className="text-xl font-bold text-yellow-200">{day.main.temp}°C</p>
        </div>
      ))}
    </div>
  );
};

export default WeatherForecast;
