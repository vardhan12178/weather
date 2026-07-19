import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet } from 'react-feather';
import WeatherIcon from './WeatherIcon';

const HourlyTemperature = ({ forecastData, isDay, textColor = 'text-white', textSubColor = 'text-white/50' }) => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    if (!forecastData?.list) return;
    // Show next 8 hourly steps (which covers 24 hours at 3-hour steps)
    setHourlyData(forecastData.list.slice(0, 8));
  }, [forecastData]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      <div
        className="flex gap-3 w-full overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hourlyData.map((hour, index) => {
          const rainChance = Math.round(hour.pop * 100);
          const isNow = index === 0;
          const timeLabel = isNow
            ? 'Now'
            : hour.localTimeLabel;

          // Interactive theme highlights for the first card (Now) vs others
          const cardBg = isNow
            ? 'bg-gradient-to-b from-brand-400/20 to-brand-500/10 border-brand-400/50 shadow-soft ring-1 ring-brand-400/20 z-10'
            : 'bg-white/50 dark:bg-slate-900/10 hover:bg-white/70 dark:hover:bg-slate-900/20 border-white/40 dark:border-white/5';

          return (
            <motion.div
              key={hour.dt}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className={`flex-shrink-0 w-[104px] snap-start p-3.5 rounded-[22px] border backdrop-blur-2xl flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${cardBg}`}
            >
              {/* Time Indicator */}
              <span className={`text-[11px] font-bold tracking-tight ${isNow ? 'text-brand-600 dark:text-brand-300' : textColor}`}>
                {timeLabel}
              </span>

              {/* Condition Icon and Rain Badge */}
              <div className="relative my-2.5 flex items-center justify-center h-12">
                <WeatherIcon
                  code={hour.weather[0].icon}
                  className="filter drop-shadow-md select-none"
                  size={36}
                />
                {rainChance > 0 && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-brand-600 dark:text-brand-300 bg-brand-500/10 dark:bg-brand-400/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 z-10">
                    <Droplet size={8} className="fill-current text-brand-500" />
                    {rainChance}%
                  </span>
                )}
              </div>

              {/* Temperature & Apparent Temp */}
              <div className="text-center mt-1">
                <span className={`text-xl font-semibold tracking-tight tnum ${textColor}`}>
                  {Math.round(hour.main.temp)}&deg;
                </span>
                <p className={`text-[9px] font-semibold tracking-tight ${textSubColor} mt-0.5`}>
                  Feels {Math.round(hour.main.feels_like)}&deg;
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HourlyTemperature;
