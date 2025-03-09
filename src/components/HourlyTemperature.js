import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WiThermometer } from 'react-icons/wi';

const HourlyTemperature = ({ lat, lon }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`
        );
        const next24Hours = response.data.list.slice(0, 9); // 3-hour intervals, 9 steps = 27 hours
        setHourlyData(next24Hours);
        setLoading(false);
      } catch (err) {
        setError('Unable to fetch hourly temperature data.');
        setLoading(false);
      }
    };

    if (lat && lon) {
      fetchHourlyData();
    }
  }, [lat, lon]);

  if (loading) return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2">Loading hourly data...</p>
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

  if (!hourlyData.length) return (
    <div className="text-center">
      <p className="text-gray-500 dark:text-gray-400">No hourly data available.</p>
    </div>
  );

  const cardClasses = "flex flex-col items-center bg-white/50 dark:bg-gray-700/20 rounded-lg p-2 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/30 transition-all duration-300";

  return (
    <div className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg p-6 text-gray-800 dark:text-white border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300 h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Hourly Temperature</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {hourlyData.map((hour, index) => {
          const { dt, main, weather } = hour;
          const { temp } = main;
          return (
            <div key={index} className={cardClasses}>
              <WiThermometer className="w-6 h-6 text-blue-600 dark:text-yellow-200" />
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {new Date(dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-gray-700 dark:text-gray-300">{temp}°C</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather[0].icon}.png`}
                alt={weather[0].description}
                className="w-10 h-10"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyTemperature;