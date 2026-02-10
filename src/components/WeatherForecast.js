import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'react-feather';

const WeatherForecast = ({ forecastData, textColor = 'text-white', textSubColor = 'text-white/50' }) => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (!forecastData?.list) return;

    const dailyMap = {};
    forecastData.list.forEach((reading) => {
      const date = reading.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { temps: [], readings: [] };
      }
      dailyMap[date].temps.push(reading.main.temp);
      dailyMap[date].readings.push(reading);
    });

    const dailyData = Object.values(dailyMap).map((day) => {
      const noonReading = day.readings.find((reading) => reading.dt_txt.includes('12:00:00')) || day.readings[0];
      return {
        ...noonReading,
        main: {
          ...noonReading.main,
          temp_max: Math.max(...day.temps),
          temp_min: Math.min(...day.temps)
        }
      };
    });

    setForecast(dailyData.slice(0, 5));
  }, [forecastData]);

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className={`${textColor} text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-4`}>5 day outlook</h3>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col w-full gap-1">
        {forecast.map((day) => {
          const date = new Date(day.dt * 1000);
          return (
            <motion.div key={day.dt} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-white/10 transition-colors">
              <div className="w-20">
                <p className={`${textColor} text-sm font-bold`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p className={`${textSubColor} text-xs`}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>

              <div className="flex items-center gap-2 flex-1 justify-center">
                <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].main} className="w-9 h-9 object-contain" />
                <span className={`${textSubColor} text-xs font-medium capitalize hidden sm:inline w-16 truncate text-center`}>{day.weather[0].main}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <ArrowUp size={12} className="text-orange-400" />
                  <span className={`${textColor} text-sm font-bold`}>{Math.round(day.main.temp_max)}&deg;</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowDown size={12} className="text-sky-400" />
                  <span className={`${textSubColor} text-sm font-semibold`}>{Math.round(day.main.temp_min)}&deg;</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default WeatherForecast;
