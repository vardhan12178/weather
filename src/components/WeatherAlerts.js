import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CloudLightning, Thermometer, Wind, X, Info } from 'react-feather';

const WeatherAlerts = ({ weatherData }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!weatherData) return null;

  const { main, wind, weather } = weatherData;
  const temp = main.temp;
  const windSpeed = wind.speed;
  const condition = weather[0].main;

  const getAlert = () => {
    // 1. Severe Storms
    if (condition === 'Thunderstorm' || condition === 'Tornado') {
      return {
        id: 'storm',
        title: 'Severe Weather',
        message: 'Thunderstorms detected. Seek shelter.',
        icon: <CloudLightning className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
        // Light Mode: Yellow-50 bg, Dark Text | Dark Mode: Yellow-900/30 bg, Light Text
        style: 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-gray-800 dark:text-yellow-100'
      };
    }

    // 2. Extreme Heat (>35°C)
    if (temp > 35) {
      return {
        id: 'heat',
        title: 'Excessive Heat',
        message: `High temperature (${Math.round(temp)}°C). Stay hydrated.`,
        icon: <Thermometer className="w-5 h-5 text-red-600 dark:text-red-400" />,
        style: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-gray-800 dark:text-red-100'
      };
    }

    // 3. Extreme Cold (<0°C)
    if (temp < 0) {
      return {
        id: 'cold',
        title: 'Freeze Warning',
        message: `Sub-zero temperatures (${Math.round(temp)}°C). Watch for ice.`,
        icon: <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
        style: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-gray-800 dark:text-blue-100'
      };
    }

    // 4. High Winds (>15m/s)
    if (windSpeed > 15) {
      return {
        id: 'wind',
        title: 'High Wind',
        message: `Gusts reaching ${Math.round(windSpeed)} m/s. Secure loose objects.`,
        icon: <Wind className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
        style: 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 text-gray-800 dark:text-orange-100'
      };
    }

    // 5. Rain/Drizzle (Info only)
    if (condition === 'Rain' || condition === 'Drizzle') {
       return {
         id: 'rain',
         title: 'Precipitation',
         message: 'Rain expected. Don\'t forget an umbrella.',
         icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-300" />,
         style: 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-400 text-gray-700 dark:text-blue-100'
       };
    }

    return null;
  };

  const alert = getAlert();

  if (!alert || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={alert.id}
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        className={`w-full rounded-r-lg shadow-sm flex items-center justify-between p-4 mb-8 ${alert.style}`}
      >
        <div className="flex items-center gap-4">
          {/* Icon Wrapper */}
          <div className="p-2 bg-white/50 dark:bg-black/20 rounded-full">
            {alert.icon}
          </div>

          <div className="flex flex-col">
            <h4 className="font-bold uppercase text-xs tracking-widest opacity-90">
              {alert.title}
            </h4>
            <p className="text-sm font-medium">
              {alert.message}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-2 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Dismiss alert"
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherAlerts;