import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wind, Droplet } from 'react-feather';

const WeatherCard = ({ weatherData, aqi, setCoordinates }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  if (!weatherData) return null;

  const { name, weather, main, wind, dt } = weatherData;
  const { main: description, icon } = weather[0];
  const { temp, humidity } = main;
  const { speed: wind_speed } = wind;

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (setCoordinates && weatherData.coord) setCoordinates(weatherData.coord);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getAQIStatus = (index) => {
    switch (index) {
      case 1: return { label: 'Excellent', color: 'bg-emerald-500 text-white shadow-emerald-500/40' };
      case 2: return { label: 'Good', color: 'bg-green-500 text-white shadow-green-500/40' };
      case 3: return { label: 'Moderate', color: 'bg-yellow-500 text-white shadow-yellow-500/40' };
      case 4: return { label: 'Poor', color: 'bg-orange-500 text-white shadow-orange-500/40' };
      case 5: return { label: 'Hazardous', color: 'bg-red-600 text-white shadow-red-600/40' };
      default: return { label: 'Unknown', color: 'bg-gray-400 text-white' };
    }
  };

  const aqiStatus = getAQIStatus(aqi?.main?.aqi);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center w-full z-10 px-4 py-6"
    >
      {/* 1. CITY NAME & DATE */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-slate-800 dark:text-white drop-shadow-sm leading-tight text-center">
          {name}
        </h1>
        <p className="text-slate-600 dark:text-blue-200 font-bold tracking-widest uppercase text-xs">
          {new Date(dt * 1000).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* 2. AQI BADGE */}
      {aqi && (
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase ${aqiStatus.color} shadow-lg mb-8`}
        >
          <span>AQI: {aqi.main.aqi}</span>
          <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
          <span>{aqiStatus.label}</span>
        </motion.div>
      )}

      {/* 3. MAIN VISUAL (Icon + Temp) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-10 relative w-full mb-10">
        
        {/* Animated Icon with Glow */}
        <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/40 blur-3xl rounded-full"></div>
            <motion.img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt={description}
              className="relative w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.25)] z-10"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
        </div>
        
        {/* Temperature & Description */}
        <div className="flex flex-col items-center sm:items-start z-10">
          <div className="flex items-start">
            <span className="text-8xl sm:text-9xl md:text-[9rem] leading-none font-black text-slate-800 dark:text-white tracking-tighter drop-shadow-sm">
              {Math.round(temp)}
            </span>
            {/* ADDED 'C' BACK HERE */}
            <span className="text-4xl sm:text-6xl font-bold text-slate-600 dark:text-blue-200 mt-4 sm:mt-6">
              °C
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-slate-600 dark:text-blue-100 capitalize -mt-2">
            {description}
          </span>
        </div>
      </div>

      {/* 4. STATS CONTROL BAR */}
      <div className="flex items-center gap-6 sm:gap-10 bg-white/40 dark:bg-black/30 px-8 py-4 rounded-3xl backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg hover:scale-105 transition-transform duration-300">
          
          {/* Wind */}
          <div className="flex flex-col items-center gap-1">
             <div className="flex items-center gap-2 text-slate-700 dark:text-blue-200">
                <Wind size={18} />
                <span className="font-black text-lg">{wind_speed}</span>
             </div>
             <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-white/40 tracking-wider">Wind (m/s)</span>
          </div>

          <div className="w-px h-8 bg-slate-900/10 dark:bg-white/10"></div>

          {/* Humidity */}
          <div className="flex flex-col items-center gap-1">
             <div className="flex items-center gap-2 text-slate-700 dark:text-blue-200">
                <Droplet size={18} />
                <span className="font-black text-lg">{humidity}%</span>
             </div>
             <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-white/40 tracking-wider">Humidity</span>
          </div>

          <div className="w-px h-8 bg-slate-900/10 dark:bg-white/10"></div>

          {/* Refresh Button */}
          <button 
            onClick={handleRefresh} 
            className="flex flex-col items-center gap-1 group"
          >
             <div className={`p-2 rounded-full bg-white/50 dark:bg-white/10 group-hover:bg-white group-hover:text-blue-500 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}>
                <RefreshCw size={18} className="text-slate-800 dark:text-white group-hover:text-blue-600" />
             </div>
             <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-white/40 tracking-wider group-hover:text-blue-600">Refresh</span>
          </button>
      </div>

    </motion.div>
  );
};

export default WeatherCard;