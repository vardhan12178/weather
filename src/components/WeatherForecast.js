import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const WeatherForecast = ({ location, coordinates }) => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        let url = '';
        if (coordinates.lat && coordinates.lon) {
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`;
        } else if (location) {
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`;
        }
        if (url) {
          const response = await axios.get(url);
          const dailyData = response.data.list.filter((reading) => 
            reading.dt_txt.includes("12:00:00")
          );
          setForecast(dailyData.slice(0, 5));
        }
      } catch (err) { console.error(err); }
    };
    fetchForecast();
  }, [location, coordinates]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {forecast.map((day, index) => {
        const date = new Date(day.dt * 1000);
        return (
          <motion.div
            key={day.dt}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-sm border border-white/10 dark:border-white/5 transition-all cursor-default group"
          >
            <div className="flex flex-col">
              <span className="text-gray-800 dark:text-blue-100 font-bold uppercase text-xs tracking-wider">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-gray-500 dark:text-white/40 text-[10px] font-medium">
                {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </span>
            </div>

            <div className="flex items-center gap-3">
               <img
                 src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                 alt="icon"
                 className="w-10 h-10 drop-shadow-sm group-hover:scale-110 transition-transform"
               />
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.round(day.main.temp)}°C
              </span>
              <span className="text-xs text-gray-500 dark:text-white/40 capitalize">
                {day.weather[0].main}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WeatherForecast;