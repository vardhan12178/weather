import React from 'react';
import { Droplet } from 'react-feather';
import WeatherIcon from './WeatherIcon';

const WeatherForecast = ({ forecastData, currentTemp, textColor = 'text-slate-950', textSubColor = 'text-slate-500' }) => {
  const forecast = forecastData?.daily || [];
  const globalMin = forecast.length ? Math.min(...forecast.map((day) => day.main.temp_min)) : 0;
  const globalMax = forecast.length ? Math.max(...forecast.map((day) => day.main.temp_max)) : 1;
  const globalRange = Math.max(1, globalMax - globalMin);

  return (
    <div>
      <div className="mb-5">
        <p className="section-eyebrow">Plan ahead</p>
        <h2 className="section-title">7-day outlook</h2>
      </div>

      <div className="grid gap-1">
        {forecast.slice(0, 7).map((day, index) => {
          const date = new Date(`${day.localDateKey}T12:00:00Z`);
          const minimum = day.main.temp_min;
          const maximum = day.main.temp_max;
          const left = ((minimum - globalMin) / globalRange) * 100;
          const width = Math.max(8, ((maximum - minimum) / globalRange) * 100);
          const current = ((currentTemp - globalMin) / globalRange) * 100;

          return (
            <div key={day.localDateKey} className="forecast-row">
              <div className="w-20 shrink-0 sm:w-24">
                <p className={`text-sm font-extrabold ${textColor}`}>{index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}</p>
                <p className={`mt-0.5 text-[11px] font-semibold ${textSubColor}`}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</p>
              </div>

              <div className="flex w-20 shrink-0 items-center gap-2">
                <WeatherIcon code={day.weather[0].icon} size={30} />
                {day.pop > 0 && <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-300"><Droplet size={10} />{day.pop}%</span>}
              </div>

              <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4">
                <span className={`w-8 text-right text-sm font-bold ${textSubColor}`}>{Math.round(minimum)}°</span>
                <div className="relative h-2 min-w-[70px] flex-1 rounded-full bg-slate-950/10 dark:bg-white/10 sm:max-w-[240px]">
                  <span className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400" style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }} />
                  {index === 0 && currentTemp >= minimum && currentTemp <= maximum && <span className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-sky-500 bg-white shadow-md dark:bg-slate-950" style={{ left: `calc(${Math.max(0, Math.min(100, current))}% - 7px)` }} />}
                </div>
                <span className={`w-8 text-left text-sm font-extrabold ${textColor}`}>{Math.round(maximum)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
