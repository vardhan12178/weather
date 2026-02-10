import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Thermometer, Wind, CloudRain, X } from 'react-feather';

const WeatherAlerts = ({ weatherData, unit = 'metric' }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!weatherData || !isVisible) return null;

  const { main, wind, weather } = weatherData;
  const condition = weather[0].main;
  const heatThreshold = unit === 'metric' ? 35 : 95;
  const coldThreshold = unit === 'metric' ? 0 : 32;
  const unitLabel = unit === 'metric' ? 'C' : 'F';

  const getAlert = () => {
    if (condition === 'Thunderstorm' || condition === 'Tornado') {
      return {
        title: 'Severe weather advisory',
        message: 'Thunderstorms detected nearby. Avoid open areas and stay indoors.',
        icon: <AlertTriangle size={16} />,
        classes: 'bg-amber-100/85 dark:bg-amber-900/35 text-amber-900 dark:text-amber-100 border-amber-400/70'
      };
    }
    if (main.temp > heatThreshold) {
      return {
        title: 'Heat advisory',
        message: `Current temperature is ${Math.round(main.temp)}${unitLabel}. Hydrate and limit direct sun exposure.`,
        icon: <Thermometer size={16} />,
        classes: 'bg-red-100/85 dark:bg-red-900/35 text-red-900 dark:text-red-100 border-red-400/70'
      };
    }
    if (main.temp < coldThreshold) {
      return {
        title: 'Freeze advisory',
        message: `Current temperature is ${Math.round(main.temp)}${unitLabel}. Surfaces may be slippery.`,
        icon: <Thermometer size={16} />,
        classes: 'bg-sky-100/85 dark:bg-sky-900/35 text-sky-900 dark:text-sky-100 border-sky-400/70'
      };
    }
    if (wind.speed > 15) {
      return {
        title: 'High wind advisory',
        message: `Wind speeds near ${Math.round(wind.speed)} m/s expected. Secure lightweight outdoor objects.`,
        icon: <Wind size={16} />,
        classes: 'bg-orange-100/85 dark:bg-orange-900/35 text-orange-900 dark:text-orange-100 border-orange-400/70'
      };
    }
    if (condition === 'Rain' || condition === 'Drizzle') {
      return {
        title: 'Rain expected',
        message: 'Carry rain gear if you are heading out in the next few hours.',
        icon: <CloudRain size={16} />,
        classes: 'bg-blue-100/85 dark:bg-blue-900/35 text-blue-900 dark:text-blue-100 border-blue-400/70'
      };
    }
    return null;
  };

  const alert = getAlert();
  if (!alert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`w-full rounded-2xl border px-4 py-3 flex items-start justify-between gap-4 ${alert.classes}`}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5">{alert.icon}</span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest">{alert.title}</p>
            <p className="text-sm font-medium mt-1">{alert.message}</p>
          </div>
        </div>
        <button onClick={() => setIsVisible(false)} className="opacity-70 hover:opacity-100 transition-opacity" aria-label="Dismiss alert">
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherAlerts;
