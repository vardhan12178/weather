import React, { useState } from 'react';
import { AlertTriangle, CloudRain, Eye, Sun, Thermometer, Wind, X } from 'react-feather';

const WeatherAlerts = ({ weatherData, unit = 'metric' }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!weatherData || !isVisible) return null;

  const { main, wind, weather, visibility, uvIndex } = weatherData;
  const condition = weather[0].condition;
  const tempC = unit === 'metric' ? main.temp : (main.temp - 32) * (5 / 9);
  const windMs = unit === 'metric' ? wind.speed : wind.speed * 0.44704;
  const windLabel = `${Math.round(wind.speed)} ${unit === 'metric' ? 'm/s' : 'mph'}`;

  const getInsight = () => {
    if (condition === 'Thunderstorm') return {
      title: 'Thunderstorm conditions',
      message: 'Avoid exposed areas and check your local authority for official warnings before travelling.',
      icon: AlertTriangle,
      theme: 'weather-insight--amber',
    };
    if (tempC >= 40) return {
      title: 'Extreme heat conditions',
      message: 'Limit afternoon exposure, hydrate regularly, and check on vulnerable people nearby.',
      icon: Thermometer,
      theme: 'weather-insight--rose',
    };
    if (tempC <= 0) return {
      title: 'Freezing conditions',
      message: 'Surfaces may become icy. Allow extra time and dress in warm layers.',
      icon: Thermometer,
      theme: 'weather-insight--sky',
    };
    if ((condition === 'Fog' || condition === 'Mist') && visibility < 1000) return {
      title: 'Low visibility',
      message: `Visibility is about ${Math.max(100, Math.round(visibility / 100) * 100)} m. Slow down and use appropriate lights while driving.`,
      icon: Eye,
      theme: 'weather-insight--slate',
    };
    if (windMs >= 15) return {
      title: 'Strong winds',
      message: `Winds near ${windLabel}. Secure loose outdoor items and take care in exposed areas.`,
      icon: Wind,
      theme: 'weather-insight--amber',
    };
    if (condition === 'Rain' || condition === 'Drizzle') return {
      title: 'Wet-weather heads-up',
      message: 'Keep an umbrella nearby and allow extra time for slippery or waterlogged routes.',
      icon: CloudRain,
      theme: 'weather-insight--sky',
    };
    if (uvIndex >= 8) return {
      title: 'Very high UV',
      message: 'Use shade, protective clothing, sunglasses, and broad-spectrum sunscreen around midday.',
      icon: Sun,
      theme: 'weather-insight--amber',
    };
    return null;
  };

  const insight = getInsight();
  if (!insight) return null;
  const Icon = insight.icon;

  return (
    <div className={`weather-insight ${insight.theme}`} role="status">
      <span className="weather-insight__icon"><Icon size={17} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em]">{insight.title}</p>
        <p className="mt-1 text-sm font-medium leading-relaxed opacity-80">{insight.message}</p>
        <p className="mt-1.5 text-[10px] font-semibold opacity-60">Weather insight · not an official emergency alert</p>
      </div>
      <button type="button" onClick={() => setIsVisible(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10" aria-label="Dismiss weather insight"><X size={16} /></button>
    </div>
  );
};

export default WeatherAlerts;
