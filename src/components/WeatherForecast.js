import React from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import { formatWeekday, formatShortDate } from '../utils/time';
import { toCelsius } from '../utils/units';

// Colour the range bar by how hot the day gets (thresholds in °C)
const getTempGradient = (maxTempC) => {
  if (maxTempC >= 38) {
    return 'from-orange-400 to-red-500 shadow-[0_0_4px_rgba(239,68,68,0.25)]';
  }
  if (maxTempC >= 30) {
    return 'from-yellow-400 via-orange-400 to-orange-500 shadow-[0_0_4px_rgba(245,158,11,0.2)]';
  }
  if (maxTempC >= 20) {
    return 'from-emerald-400 via-yellow-400 to-amber-400 shadow-[0_0_4px_rgba(52,211,153,0.15)]';
  }
  return 'from-sky-400 to-indigo-500 shadow-[0_0_4px_rgba(56,189,248,0.2)]';
};

const WeatherForecast = ({ forecastData, currentTemp, unit = 'metric', textColor = 'text-white', textSubColor = 'text-white/50' }) => {
  const forecast = forecastData?.daily ?? [];
  const timeZone = forecastData?.timezoneName;
  if (!forecast.length) return null;

  // Global min/max across the week to scale the range bars
  const globalMin = Math.min(...forecast.map((d) => d.temp_min));
  const globalMax = Math.max(...forecast.map((d) => d.temp_max));
  const globalRange = globalMax - globalMin;

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className={`${textColor} text-[10px] font-extrabold uppercase tracking-widest opacity-60 mb-5`}>
        {forecast.length}-Day Forecast
      </h3>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col w-full gap-2.5">
        {forecast.map((day, index) => {
          const dayMin = day.temp_min;
          const dayMax = day.temp_max;
          const rainChance = Math.round(day.pop * 100);

          const leftPct = globalRange > 0 ? ((dayMin - globalMin) / globalRange) * 100 : 0;
          const widthPct = globalRange > 0 ? ((dayMax - dayMin) / globalRange) * 100 : 100;
          const currentPct = globalRange > 0 && currentTemp != null ? ((currentTemp - globalMin) / globalRange) * 100 : 0;

          const dayLabel = index === 0 ? 'Today' : formatWeekday(day.dt, timeZone);

          return (
            <motion.div
              key={day.dt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between py-2.5 px-4 rounded-2xl hover:bg-slate-950/5 dark:hover:bg-white/5 transition-all duration-200"
            >
              {/* Day Name & Date */}
              <div className="w-16 shrink-0">
                <p className={`${textColor} text-xs font-bold tracking-tight`}>{dayLabel}</p>
                <p className={`${textSubColor} text-[10px] font-semibold mt-0.5`}>
                  {formatShortDate(day.dt, timeZone)}
                </p>
              </div>

              {/* Condition icon + chance of rain */}
              <div className="flex flex-col items-center justify-center shrink-0 w-12">
                <WeatherIcon code={day.weather[0].icon} size={28} />
                {rainChance >= 20 && (
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-300 tnum">{rainChance}%</span>
                )}
              </div>

              {/* Apple Weather-style temperature range bar */}
              <div className="flex-grow flex items-center gap-3 justify-end min-w-0">
                <span className={`${textSubColor} text-[11px] font-bold w-8 text-right shrink-0`}>
                  {Math.round(dayMin)}&deg;
                </span>

                <div className="relative flex-grow max-w-[130px] sm:max-w-[180px] h-2 bg-slate-950/10 dark:bg-white/10 rounded-full overflow-visible flex items-center">
                  <div
                    className={`absolute h-full rounded-full bg-gradient-to-r ${getTempGradient(toCelsius(dayMax, unit))}`}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />

                  {/* Current temperature marker (today only) */}
                  {index === 0 && currentTemp != null && currentTemp >= dayMin && currentTemp <= dayMax && (
                    <div
                      className="absolute w-3.5 h-3.5 bg-white dark:bg-slate-900 border-2 border-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.9)] z-10"
                      style={{ left: `calc(${currentPct}% - 7px)` }}
                    />
                  )}
                </div>

                <span className={`${textColor} text-[11px] font-bold w-8 text-left shrink-0`}>
                  {Math.round(dayMax)}&deg;
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default WeatherForecast;
