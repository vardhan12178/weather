import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';

const WeatherForecast = ({ forecastData, currentTemp, textColor = 'text-white', textSubColor = 'text-white/50' }) => {
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

  // Calculate global min and max for the 5-day period to scale the visual bars
  const tempsMin = forecast.map((d) => d.main.temp_min);
  const tempsMax = forecast.map((d) => d.main.temp_max);
  const globalMin = tempsMin.length ? Math.min(...tempsMin) : 0;
  const globalMax = tempsMax.length ? Math.max(...tempsMax) : 100;
  const globalRange = globalMax - globalMin;

  // Select a sophisticated gradient styling based on temperature boundaries
  const getTempGradient = (maxTemp) => {
    if (maxTemp >= 38) {
      return 'from-orange-400 to-red-500 shadow-[0_0_4px_rgba(239,68,68,0.25)]';
    }
    if (maxTemp >= 30) {
      return 'from-yellow-400 via-orange-450 to-orange-500 shadow-[0_0_4px_rgba(245,158,11,0.2)]';
    }
    if (maxTemp >= 20) {
      return 'from-emerald-400 via-yellow-400 to-amber-400 shadow-[0_0_4px_rgba(52,211,153,0.15)]';
    }
    return 'from-sky-400 to-indigo-500 shadow-[0_0_4px_rgba(56,189,248,0.2)]';
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className={`${textColor} text-[10px] font-extrabold uppercase tracking-widest opacity-60 mb-5`}>
        5-Day Outlook
      </h3>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col w-full gap-2.5">
        {forecast.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const dayMin = day.main.temp_min;
          const dayMax = day.main.temp_max;

          // Calculate relative percentage positions for the span bar
          const leftPct = globalRange > 0 ? ((dayMin - globalMin) / globalRange) * 100 : 0;
          const widthPct = globalRange > 0 ? ((dayMax - dayMin) / globalRange) * 100 : 100;
          const currentPct = globalRange > 0 && currentTemp != null ? ((currentTemp - globalMin) / globalRange) * 100 : 0;

          // Human-readable day label (Today instead of Day Name for index 0)
          const dayLabel = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          const tempGradClass = getTempGradient(dayMax);

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
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Weather Condition Icon */}
              <div className="flex items-center justify-center shrink-0 w-12">
                <WeatherIcon code={day.weather[0].icon} size={28} />
              </div>

              {/* Apple Weather-style temperature span bar - expanded size */}
              <div className="flex-grow flex items-center gap-3 justify-end min-w-0">
                <span className={`${textSubColor} text-[11px] font-bold w-8 text-right shrink-0`}>
                  {Math.round(dayMin)}&deg;
                </span>
                
                <div className="relative flex-grow max-w-[130px] sm:max-w-[180px] h-2 bg-slate-950/10 dark:bg-white/10 rounded-full overflow-visible flex items-center">
                  {/* Active range bar segment with temp gradient */}
                  <div
                    className={`absolute h-full rounded-full bg-gradient-to-r ${tempGradClass}`}
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                    }}
                  />
                  
                  {/* Current temp glowing indicator (Today only) */}
                  {index === 0 && currentTemp != null && currentTemp >= dayMin && currentTemp <= dayMax && (
                    <div
                      className="absolute w-3.5 h-3.5 bg-white dark:bg-slate-900 border-2 border-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.9)] z-10"
                      style={{
                        left: `calc(${currentPct}% - 7px)`,
                      }}
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
