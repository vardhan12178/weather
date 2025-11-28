import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const HourlyTemperature = ({ lat, lon }) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`
        );
        setHourlyData(response.data.list.slice(0, 5));
      } catch (err) {}
    };
    if (lat && lon) fetchHourlyData();
  }, [lat, lon]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {hourlyData.map((hour, index) => (
        <motion.div
          key={hour.dt}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-sm border border-white/10 dark:border-white/5 transition-all cursor-default group"
        >
          <div className="flex flex-col">
            <span className="text-gray-800 dark:text-blue-100 font-bold text-sm">
              {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true })}
            </span>
            <span className="text-xs text-gray-500 dark:text-white/40">
               {Math.round(hour.pop * 100)}% Rain
            </span>
          </div>

          <img
            src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
            alt="icon"
            className="w-10 h-10 drop-shadow-sm group-hover:scale-110 transition-transform"
          />

          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {Math.round(hour.main.temp)}°C
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default HourlyTemperature;