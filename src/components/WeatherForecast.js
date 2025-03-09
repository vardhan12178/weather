import { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherForecast = ({ location, coordinates, start, end, hoverEffect }) => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setError('');
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [location, coordinates, start, end]);

  const renderIcon = (iconCode) => {
    return (
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt="Weather icon"
        className="w-16 h-16"
      />
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (loading) return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2">Loading forecast...</p>
    </div>
  );

  if (error) return (
    <div className="text-center bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
      <p className="text-red-500 dark:text-red-300">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  if (!forecastData.length) return (
    <div className="text-center">
      <p className="text-gray-500 dark:text-gray-400">No forecast data available.</p>
    </div>
  );

  const cardClasses = `bg-white dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg p-4 text-center text-gray-800 dark:text-white border border-white/10 dark:border-gray-700/20 ${
    hoverEffect ? 'transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl' : ''
  }`;

  return (
    <div className={cardClasses}>
      {forecastData.map((day, index) => {
        const { dt_txt, weather, main, wind } = day;
        const { description, icon } = weather[0];
        const { temp, feels_like } = main;
        return (
          <div key={index} className="mb-4">
            {/* Date */}
            <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
              {formatDate(dt_txt)}
            </p>

            {/* Weather Icon */}
            <div className="my-3 flex justify-center items-center">
              {renderIcon(icon)}
            </div>

            {/* Weather Description */}
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 capitalize">
              {description}
            </p>

            {/* Temperature */}
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-yellow-200 mt-2">
              {temp}°C
            </p>

            {/* Feels Like Temperature */}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Feels like {feels_like}°C
            </p>

            {/* Wind Speed */}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Wind: {wind.speed} m/s
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherForecast;