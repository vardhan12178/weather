import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet } from 'react-feather';

const HourlyTemperature = ({ forecastData, isDay, textColor = 'text-white', textSubColor = 'text-white/50' }) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    if (!forecastData?.list) return;
    setHourlyData(forecastData.list.slice(0, 8));
  }, [forecastData]);

  const itemClass = isDay
    ? 'bg-white/55 backdrop-blur-xl border border-white/55 shadow-xl'
    : 'bg-slate-900/35 backdrop-blur-xl border border-white/15 shadow-lg';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      <div className="flex gap-3 w-full overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {hourlyData.map((hour) => {
          const rainChance = Math.round(hour.pop * 100);
          return (
            <motion.div
              key={hour.dt}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex-shrink-0 w-56 snap-start p-3 px-4 rounded-2xl ${itemClass} hover:scale-[1.01] transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${textColor} font-bold text-sm`}>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true })}</p>
                  <p className={`${textSubColor} text-xs mt-0.5 capitalize`}>{hour.weather[0].main}</p>
                </div>
                <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt={hour.weather[0].main} className="w-10 h-10 object-contain" />
              </div>

              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className={`${textColor} text-2xl font-black leading-none`}>{Math.round(hour.main.temp)}&deg;</p>
                  <p className={`${textSubColor} text-[11px] mt-1`}>Feels {Math.round(hour.main.feels_like)}&deg;</p>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-sky-500/15 text-sky-700 dark:text-sky-200 text-xs font-semibold">
                  <Droplet size={12} />
                  {rainChance}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HourlyTemperature;
