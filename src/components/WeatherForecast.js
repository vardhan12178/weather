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
    <div className="w-full h-full flex flex-col justify-center">
      <h3 className="text-slate-700 dark:text-slate-300 font-bold text-sm mb-4 ml-1 uppercase tracking-wider opacity-80">
        5-Day Forecast
      </h3>

      <div className="flex flex-col gap-3 w-full">
        {forecast.map((day, index) => {
          const date = new Date(day.dt * 1000);
          
          return (
            <motion.div
              key={day.dt}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="flex items-center justify-between p-3 px-5 rounded-3xl 
                         bg-white/40 dark:bg-black/30 
                         border border-white/50 dark:border-white/10
                         backdrop-blur-md shadow-sm
                         hover:bg-white/60 dark:hover:bg-white/10 hover:scale-[1.02] 
                         transition-all duration-300 cursor-pointer group"
            >
              {/* Left: Day & Date */}
              <div className="flex flex-col">
                <span className="text-gray-900 dark:text-white font-black uppercase text-sm tracking-wide">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-[11px] font-semibold uppercase opacity-80">
                  {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Center: Icon */}
              <div className="flex items-center justify-center">
                 <img
                   src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                   alt="icon"
                   className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-125 transition-transform duration-300"
                 />
              </div>

              {/* Right: Temp & Condition */}
              <div className="flex flex-col items-end">
                <div className="flex items-start">
                   <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                     {Math.round(day.main.temp)}
                   </span>
                   <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1 ml-0.5">°C</span>
                </div>
                
                <span className="text-[10px] text-gray-700 dark:text-gray-300 font-bold capitalize bg-white/30 dark:bg-white/10 px-2 py-0.5 rounded-full mt-0.5 border border-white/20">
                  {day.weather[0].main}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;