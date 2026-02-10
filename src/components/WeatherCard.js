import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Star, Thermometer } from 'react-feather';

const WeatherCard = ({
  weatherData,
  aqi,
  setCoordinates,
  unit,
  toggleUnit,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  favorites,
  textColor = 'text-white',
  glassClass
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  if (!weatherData) return null;

  const { name, weather, main, dt, coord } = weatherData;
  const { temp, feels_like, temp_max, temp_min } = main;
  const summary = weather[0];

  const buttonClass = `inline-flex items-center justify-center rounded-full transition-colors ${
    glassClass ? 'bg-white/20 hover:bg-white/35' : 'bg-black/20 hover:bg-black/35'
  }`;

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (setCoordinates && coord) setCoordinates(coord);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(name);
      return;
    }
    addToFavorites(weatherData);
  };

  const getAQIStatus = (index) => {
    switch (index) {
      case 1:
        return { label: 'Excellent', classes: 'bg-emerald-500/90 text-white' };
      case 2:
        return { label: 'Good', classes: 'bg-green-500/90 text-white' };
      case 3:
        return { label: 'Moderate', classes: 'bg-amber-500/90 text-white' };
      case 4:
        return { label: 'Poor', classes: 'bg-orange-500/90 text-white' };
      case 5:
        return { label: 'Hazardous', classes: 'bg-red-600/90 text-white' };
      default:
        return { label: 'Unknown', classes: 'bg-slate-500/90 text-white' };
    }
  };

  const aqiStatus = getAQIStatus(aqi?.main?.aqi);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="relative">
      <div className="absolute top-0 right-0 flex items-center gap-2">
        <button onClick={toggleUnit} className={`${buttonClass} px-4 py-2 ${textColor} text-xs font-bold tracking-widest shadow-lg`}>
          {unit === 'metric' ? 'C' : 'F'}
        </button>
        <button onClick={handleRefresh} className={`${buttonClass} p-2.5 ${textColor} shadow-lg ${isRefreshing ? 'animate-spin' : ''}`}>
          <RefreshCw size={16} />
        </button>
        <button
          onClick={handleFavoriteClick}
          className={`${buttonClass} p-2.5 ${isFavorite ? 'bg-amber-400/90 hover:bg-amber-300 text-slate-900' : `${textColor}`}`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          disabled={!isFavorite && favorites?.length >= 5}
        >
          <Star size={16} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="pt-14 text-center sm:text-left">
        <p className={`${textColor} opacity-70 font-semibold text-xs uppercase tracking-[0.2em]`}>
          {new Date(dt * 1000).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h2 className={`${textColor} text-4xl sm:text-5xl font-black mt-1 tracking-tight`}>{name}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 items-center">
        <div className="flex items-center gap-4">
          <img src={`https://openweathermap.org/img/wn/${summary.icon}@4x.png`} alt={summary.main} className="w-28 h-28 sm:w-32 sm:h-32 object-contain" />
          <div>
            <p className={`${textColor} text-6xl sm:text-7xl font-black leading-none`}>{Math.round(temp)}</p>
            <p className={`${textColor} opacity-80 text-lg font-semibold capitalize`}>{summary.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/25 dark:bg-white/10 p-3">
            <p className={`${textColor} text-[10px] uppercase tracking-widest opacity-60`}>Feels like</p>
            <p className={`${textColor} text-xl font-bold mt-1`}>{Math.round(feels_like)}&deg;</p>
          </div>
          <div className="rounded-2xl bg-white/25 dark:bg-white/10 p-3">
            <p className={`${textColor} text-[10px] uppercase tracking-widest opacity-60`}>High</p>
            <p className={`${textColor} text-xl font-bold mt-1`}>{Math.round(temp_max)}&deg;</p>
          </div>
          <div className="rounded-2xl bg-white/25 dark:bg-white/10 p-3">
            <p className={`${textColor} text-[10px] uppercase tracking-widest opacity-60`}>Low</p>
            <p className={`${textColor} text-xl font-bold mt-1`}>{Math.round(temp_min)}&deg;</p>
          </div>
          <div className="rounded-2xl bg-white/25 dark:bg-white/10 p-3">
            <div className="flex items-center gap-1.5">
              <Thermometer size={14} className={`${textColor} opacity-70`} />
              <p className={`${textColor} text-[10px] uppercase tracking-widest opacity-60`}>Air quality</p>
            </div>
            <p className={`${textColor} text-sm font-bold mt-1`}>{aqi ? `AQI ${aqi.main.aqi} ${aqiStatus.label}` : 'Unavailable'}</p>
          </div>
        </div>
      </div>

      {aqi && (
        <div className="mt-5 flex justify-center sm:justify-start">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${aqiStatus.classes}`}>Air quality {aqiStatus.label}</span>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCard;
