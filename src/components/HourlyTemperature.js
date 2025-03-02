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
        // Filter data for the next 24 hours
        const next24Hours = response.data.list.slice(0, 9); // 3-hour intervals, 9 steps = 27 hours (3 rows of 3 items)
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

  if (loading) return <p className="text-center">Loading hourly data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg p-6 text-gray-800 dark:text-white border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300 h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Hourly Temperature</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {hourlyData.map((hour, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white/50 dark:bg-gray-700/20 rounded-lg p-3 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/30 transition-all duration-300"
          >
            <WiThermometer className="w-6 h-6 text-blue-600 dark:text-yellow-200" />
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{hour.main.temp}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyTemperature;