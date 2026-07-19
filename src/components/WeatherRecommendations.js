import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Compass, X } from 'react-feather';

const WeatherRecommendations = ({ weatherData, unit = 'metric' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  if (!weatherData || !isVisible) return null;

  const { main, weather, wind, dt, timezone } = weatherData;
  const tempC = unit === 'metric' ? main.temp : (main.temp - 32) * (5 / 9);
  const windMs = unit === 'metric' ? wind.speed : wind.speed * 0.44704;
  const condition = weather[0].condition;
  const localDate = new Date((dt + timezone) * 1000);
  const localHour = localDate.getUTCHours();
  const isNight = localHour < 6 || localHour >= 20;

  const getRecommendation = () => {
    if (condition === 'Thunderstorm') return 'Stay close to shelter and check official local warnings before travelling.';
    if (condition === 'Rain' || condition === 'Drizzle') return 'An umbrella and water-resistant shoes will make the next trip easier.';
    if (condition === 'Snow') return 'Dress in layers and allow extra braking distance on untreated roads.';
    if (tempC >= 38) return 'Plan strenuous activity for early morning or evening and carry water.';
    if (tempC <= 8) return 'A warm outer layer will help, especially after sunset or in the wind.';
    if (windMs >= 10) return 'It is breezy enough to affect cycling and unsecured outdoor items.';
    if (main.humidity >= 80) return 'High humidity may make it feel warmer; lighter clothing will be more comfortable.';
    if (condition === 'Clear' && !isNight) return 'Clear conditions make this a good outdoor window—remember sun protection around midday.';
    if (condition === 'Clear' && isNight) return 'Clear skies should offer good visibility for an evening walk or stargazing.';
    return 'Conditions look manageable for everyday plans. Check the hourly forecast before a longer trip.';
  };

  return (
    <div className="weather-recommendation">
      <span className="weather-insight__icon"><Compass size={17} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-700 dark:text-slate-200">Plan your day</p>
        <p className={`mt-1 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 ${isExpanded ? '' : 'line-clamp-2'}`}>{getRecommendation()}</p>
      </div>
      <div className="flex shrink-0 items-center">
        <button type="button" onClick={() => setIsExpanded((expanded) => !expanded)} className="grid h-11 w-11 place-items-center rounded-full text-slate-500 transition hover:bg-black/5 dark:hover:bg-white/10" aria-label={isExpanded ? 'Collapse recommendation' : 'Expand recommendation'}>{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
        <button type="button" onClick={() => setIsVisible(false)} className="grid h-11 w-11 place-items-center rounded-full text-slate-500 transition hover:bg-black/5 dark:hover:bg-white/10" aria-label="Dismiss recommendation"><X size={16} /></button>
      </div>
    </div>
  );
};

export default WeatherRecommendations;
