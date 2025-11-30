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
    <div className="w-full h-full flex flex-col justify-center">
      <h3 className="text-slate-700 dark:text-slate-300 font-bold text-sm mb-4 ml-1 uppercase tracking-wider opacity-80">
        Hourly Forecast
      </h3>

      <div className="flex flex-col gap-3 w-full">
        {hourlyData.map((hour, index) => {
          const rainChance = Math.round(hour.pop * 100);
          
          return (
            <motion.div
              key={hour.dt}
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="flex items-center justify-between p-3 px-5 rounded-3xl 
                         bg-white/40 dark:bg-black/30
                         border border-white/50 dark:border-white/10
                         backdrop-blur-md shadow-sm
                         hover:bg-white/60 dark:hover:bg-white/10 hover:scale-[1.02] 
                         transition-all duration-300 cursor-pointer group"
            >
              {/* Left: Time and Condition */}
              <div className="flex flex-col gap-1">
                <span className="text-gray-900 dark:text-white font-bold text-base tracking-wide">
                  {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true })}
                </span>
                
                {rainChance > 0 ? (
                  <span className="inline-flex items-center justify-center bg-blue-600 rounded-full px-2 py-0.5 text-[10px] font-bold text-white w-fit shadow-sm">
                    💧 {rainChance}%
                  </span>
                ) : (
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold capitalize">
                    {hour.weather[0].main}
                  </span>
                )}
              </div>

              {/* Center: Icon */}
              <div className="relative">
                <img
                  src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                  alt="icon"
                  className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Right: Temperature */}
              <div className="flex items-start">
                  <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {Math.round(hour.main.temp)}
                  </span>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-1 ml-0.5">°C</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyTemperature;