import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Star, List, BarChart2 } from 'react-feather';
import WeatherIcon from './WeatherIcon';
import WeatherAlerts from './WeatherAlerts';
import WeatherRecommendations from './WeatherRecommendations';
import HourlyTemperature from './HourlyTemperature';
import TemperatureChart from './TemperatureChart';
import PrecipitationChart from './PrecipitationChart';
import WeatherForecast from './WeatherForecast';

// ── AQI Status Metadata ────────────────────────────────────────────────────────
const getAQIStatus = (index) => {
  switch (index) {
    case 1: return { label: 'Good',      emoji: '😊', colorClass: 'bg-emerald-500', textClass: 'text-emerald-500' };
    case 2: return { label: 'Fair',      emoji: '🙂', colorClass: 'bg-green-500', textClass: 'text-green-500' };
    case 3: return { label: 'Moderate',  emoji: '😐', colorClass: 'bg-amber-500', textClass: 'text-amber-500' };
    case 4: return { label: 'Poor',      emoji: '😷', colorClass: 'bg-orange-500', textClass: 'text-orange-500' };
    case 5: return { label: 'Hazardous', emoji: '🚨', colorClass: 'bg-red-600', textClass: 'text-red-500' };
    default: return { label: 'Unknown',  emoji: '❓', colorClass: 'bg-slate-500', textClass: 'text-slate-500' };
  }
};

// ── AQI Soft Translucent Background Gradient Theme ────────────────────────────
const getAQITheme = (index) => {
  switch (index) {
    case 1: // Good
      return 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-800 dark:text-emerald-300';
    case 2: // Fair
      return 'from-green-500/10 via-green-500/5 to-transparent border-green-500/20 text-green-800 dark:text-green-300';
    case 3: // Moderate
      return 'from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20 text-amber-800 dark:text-amber-300';
    case 4: // Poor
      return 'from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/20 text-orange-850 dark:text-orange-300';
    case 5: // Hazardous
      return 'from-red-500/10 via-red-500/5 to-transparent border-red-500/20 text-red-800 dark:text-red-300';
    default:
      return 'from-slate-500/10 via-slate-500/5 to-transparent border-slate-500/20 text-slate-800 dark:text-slate-355';
  }
};

const formatLocalTime = (timezoneOffset = 0) => {
  const localTime = new Date(Date.now() + timezoneOffset * 1000);
  return localTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
};

const WeatherCard = ({
  weatherData,
  forecastData,
  aqi,
  setCoordinates,
  unit,
  toggleUnit,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  favorites,
  textColor = 'text-white',
  textSubColor = 'text-white/50',
  isDay,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  if (!weatherData) return null;

  const { name, weather, main, dt, coord, sys, timezone } = weatherData;
  const { temp, feels_like, temp_max, temp_min } = main;
  const summary = weather[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (setCoordinates && coord) setCoordinates(coord);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(name);
    } else {
      addToFavorites(weatherData);
    }
  };

  const aqiStatus = getAQIStatus(aqi?.main?.aqi);
  const aqiThemeClass = getAQITheme(aqi?.main?.aqi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex flex-col h-full justify-between"
    >
      {/* 1. Header Information Row */}
      <div className="flex items-center justify-between gap-4 w-full">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-500 dark:text-sky-300/80">
            {new Date(dt * 1000).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
            {name}
            {sys?.country && <span className="text-lg font-bold text-slate-400 dark:text-slate-500 ml-1.5">{sys.country}</span>}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span>Local Time {formatLocalTime(timezone)}</span>
            <span className="text-slate-300 dark:text-slate-700/60 font-black">•</span>
            <span>
              {coord?.lat && coord?.lon
                ? `Lat ${coord.lat.toFixed(2)} | Lon ${coord.lon.toFixed(2)}`
                : 'Current Location'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleUnit}
            className="w-9 h-9 rounded-full bg-slate-955/5 hover:bg-slate-955/10 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white flex items-center justify-center text-xs font-black transition-all border border-slate-955/5 dark:border-white/10 active:scale-95 shadow-sm"
            title={unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
          >
            °{unit === 'metric' ? 'F' : 'C'}
          </button>
          <button
            onClick={handleRefresh}
            className="w-9 h-9 rounded-full bg-slate-955/5 hover:bg-slate-955/10 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white flex items-center justify-center transition-all border border-slate-955/5 dark:border-white/10 active:scale-95 shadow-sm"
            title="Refresh weather"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleFavoriteClick}
            disabled={!isFavorite && favorites?.length >= 5}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border active:scale-95 shadow-sm ${
              isFavorite
                ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-md shadow-amber-400/20 hover:bg-amber-300 hover:border-amber-300'
                : 'bg-slate-955/5 hover:bg-slate-955/10 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white border-slate-955/5 dark:border-white/10'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={13} className={isFavorite ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* 2. Main Current Condition & Core Stats Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-8">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-500/15 dark:bg-sky-400/10 blur-3xl rounded-full" />
            <WeatherIcon
              code={summary.icon}
              className="relative w-28 h-28 sm:w-36 sm:h-36 drop-shadow-md select-none"
              size={144}
            />
          </div>

          <div className="leading-none">
            <div className="flex items-start">
              <span className="text-7xl sm:text-8xl font-black tracking-tighter text-slate-900 dark:text-white select-none">
                {Math.round(temp)}
              </span>
              <span className="text-4xl sm:text-5xl font-light text-slate-400 dark:text-sky-300/60 mt-1 select-none">°</span>
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize mt-2.5 tracking-tight">
              {summary.description}
            </p>
          </div>
        </div>

        {/* Quick High/Low apparent sub-grid */}
        <div className="grid grid-cols-2 gap-3 w-full sm:w-auto min-w-[240px]">
          <div className="rounded-2xl bg-slate-955/5 dark:bg-white/5 border border-slate-955/5 dark:border-white/5 p-4 flex flex-col justify-between shadow-sm">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Feels Like</span>
            <span className="text-xl font-black text-slate-900 dark:text-white mt-1.5">{Math.round(feels_like)}°</span>
          </div>

          <div className="rounded-2xl bg-slate-955/5 dark:bg-white/5 border border-slate-955/5 dark:border-white/5 p-4 flex flex-col justify-between shadow-sm">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">High / Low</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1.5">
              {Math.round(temp_max)}° <span className="text-slate-400 dark:text-slate-500 font-medium">/</span> {Math.round(temp_min)}°
            </span>
          </div>
        </div>
      </div>

      {/* 3. Integrated Alerts & Recommendations Panel */}
      <div className="flex flex-col gap-3 w-full mb-6">
        <WeatherAlerts weatherData={weatherData} unit={unit} />
        <WeatherRecommendations weatherData={weatherData} />
      </div>

      {/* 4. Air Quality Summary Bar - upgraded from dull gray to soft dynamic gradient card */}
      {aqi && (
        <div className={`w-full mb-6 p-4 rounded-2xl bg-gradient-to-r ${aqiThemeClass} border backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-soft`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${aqiStatus.colorClass} shadow-sm animate-pulse`} />
            <span className="text-xs font-bold">
              Air Quality is <span className={aqiStatus.textClass}>{aqiStatus.label}</span> (AQI {aqi.main.aqi})
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto py-0.5 hide-scrollbar">
            {[
              { key: 'pm2_5', label: 'PM₂.₅' },
              { key: 'pm10',  label: 'PM₁₀' },
              { key: 'no2',   label: 'NO₂' },
              { key: 'o3',    label: 'O₃' },
            ].map(({ key, label }) =>
              aqi.components[key] != null ? (
                <div key={key} className="flex items-center gap-1 bg-white/40 dark:bg-white/10 rounded-full px-2.5 py-0.5 border border-slate-955/10 dark:border-white/10">
                  <span className="text-[9px] opacity-60 font-bold">{label}</span>
                  <span className="text-xs font-extrabold">{aqi.components[key].toFixed(0)}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Divider rule */}
      <div className="h-[1px] bg-slate-955/5 dark:bg-white/5 my-2" />

      {/* 5. Next 24 Hours Timeline Section */}
      {forecastData && (
        <div className="mt-6 w-full">
          <div className="flex items-center justify-between mb-5">
            <h3 className={`${textColor} font-extrabold text-[10px] uppercase tracking-widest opacity-60`}>
              Next 24 Hours
            </h3>
            <div className="flex gap-1 bg-black/5 dark:bg-white/10 rounded-full p-1 border border-slate-955/5 dark:border-white/5 shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-300 shadow-md scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-300'
                }`}
                title="List view"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`p-2 rounded-full transition-all duration-300 ${
                  viewMode === 'chart'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-300 shadow-md scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-300'
                }`}
                title="Chart view"
              >
                <BarChart2 size={14} />
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <HourlyTemperature forecastData={forecastData} isDay={isDay} textColor={textColor} textSubColor={textSubColor} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TemperatureChart forecastData={forecastData} unit={unit} />
              <PrecipitationChart forecastData={forecastData} />
            </div>
          )}
        </div>
      )}

      {/* Divider rule */}
      <div className="h-[1px] bg-slate-955/5 dark:bg-white/5 my-6" />

      {/* 6. 5-Day Outlook - Integrated directly inside the Weather Sheet */}
      {forecastData && (
        <div className="w-full">
          <WeatherForecast
            forecastData={forecastData}
            currentTemp={temp}
            textColor={textColor}
            textSubColor={textSubColor}
          />
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCard;
