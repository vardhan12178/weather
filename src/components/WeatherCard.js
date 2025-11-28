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
      case 1: return { label: 'Good', color: 'bg-green-500 shadow-green-500/50' };
      case 2: return { label: 'Fair', color: 'bg-yellow-500 shadow-yellow-500/50' };
      case 3: return { label: 'Moderate', color: 'bg-orange-500 shadow-orange-500/50' };
      case 4: return { label: 'Unhealthy', color: 'bg-red-500 shadow-red-500/50' };
      case 5: return { label: 'Hazardous', color: 'bg-purple-500 shadow-purple-500/50' };
      default: return { label: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const aqiStatus = getAQIStatus(aqi?.main?.aqi);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center w-full z-10 px-4"
    >
      {/* 1. Header */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-12 w-full">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white drop-shadow-sm leading-tight break-words max-w-full">
          {name}
        </h1>
        
        {aqi && (
           <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs sm:text-sm font-bold tracking-wide uppercase ${aqiStatus.color} shadow-lg backdrop-blur-sm whitespace-nowrap`}>
             <span>AQI Level {aqi.main.aqi}</span>
             <span>•</span>
             <span>{aqiStatus.label}</span>
           </div>
        )}
      </div>

      {/* 2. Main Visual */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 relative w-full">
        <motion.img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={description}
          className="w-40 h-40 sm:w-56 sm:h-56 drop-shadow-2xl object-contain filter dark:brightness-125 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
        
        <div className="flex flex-col items-center sm:items-start">
          {/* TEMP DISPLAY WITH BETTER ALIGNMENT */}
          <div className="flex items-start">
            <span className="text-7xl sm:text-9xl md:text-[8rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-500 dark:from-white dark:to-white/50">
              {Math.round(temp)}
            </span>
            {/* Grouped °C together for better kerning */}
            <span className="text-3xl sm:text-5xl font-bold text-gray-700 dark:text-white mt-2 sm:mt-4 ml-1 opacity-80">
              °C
            </span>
          </div>
          
          <span className="text-2xl sm:text-3xl font-medium text-gray-600 dark:text-blue-100 capitalize mt-[-5px] sm:mt-[-10px]">
            {description}
          </span>
        </div>
      </div>

      {/* 3. Stats */}
      <div className="flex items-center gap-4 sm:gap-8 mt-8 sm:mt-12 bg-white/40 dark:bg-black/30 px-6 sm:px-8 py-2 sm:py-3 rounded-full backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm max-w-full overflow-hidden">
         <div className="flex items-center gap-2 text-gray-700 dark:text-blue-100">
           <Wind size={16} className="sm:w-[18px]" />
           <span className="font-bold text-sm sm:text-base whitespace-nowrap">{wind_speed} m/s</span>
         </div>
         <div className="w-px h-4 bg-gray-400 dark:bg-white/20"></div>
         <div className="flex items-center gap-2 text-gray-700 dark:text-blue-100">
           <Droplet size={16} className="sm:w-[18px]" />
           <span className="font-bold text-sm sm:text-base whitespace-nowrap">{humidity}%</span>
         </div>
         <div className="w-px h-4 bg-gray-400 dark:bg-white/20"></div>
         <button onClick={handleRefresh} className={`${isRefreshing ? 'animate-spin' : ''} p-1`}>
           <RefreshCw size={16} className="text-gray-700 dark:text-blue-100 sm:w-[18px]" />
         </button>
      </div>

      <p className="mt-6 text-gray-500 dark:text-white/40 font-medium tracking-wide uppercase text-xs">
        {new Date(dt * 1000).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>
    </motion.div>
  );
};

export default WeatherCard;