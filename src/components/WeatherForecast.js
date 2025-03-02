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
        return <WiDaySunny className="w-10 h-10 text-yellow-400 dark:text-yellow-300" />;
      case 'Clouds':
        return <WiCloudy className="w-10 h-10 text-gray-400 dark:text-gray-300" />;
      case 'Rain':
        return <WiRain className="w-10 h-10 text-blue-400 dark:text-blue-300" />;
      case 'Snow':
        return <WiSnow className="w-10 h-10 text-white dark:text-gray-200" />;
      default:
        return <WiDaySunny className="w-10 h-10 text-yellow-400 dark:text-yellow-300" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg p-4 text-center text-gray-800 dark:text-white border border-white/10 dark:border-gray-700/20 ${
        hoverEffect ? 'transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl' : ''
      }`}
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {forecastData.map((day, index) => (
        <div key={index} className="mb-4">
          {/* Date */}
          <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
            {formatDate(day.dt_txt)}
          </p>

          {/* Weather Icon */}
          <div className="my-3 flex justify-center items-center">
            {renderIcon(day.weather[0].main)}
          </div>
          {/* Weather Description */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 capitalize">
            {day.weather[0].description}
          </p>

          {/* Temperature */}
          <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-yellow-200 mt-2">
            {day.main.temp}°C
          </p>
        </div>
      ))}
    </div>
  );
};

export default WeatherForecast;