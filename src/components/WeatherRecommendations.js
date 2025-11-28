import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WiDaySunny, WiMoonAltWaxingCrescent3, WiStars, WiStrongWind, WiHumidity } from 'react-icons/wi';
import { X, Activity } from 'react-feather';

const WeatherRecommendations = ({ weatherData }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!weatherData || !isVisible) return null;

  const { main, weather, wind, dt, timezone } = weatherData;
  const temp = main.temp;
  const condition = weather[0].main;
  const windSpeed = wind.speed;
  
  const localTime = new Date((dt + timezone) * 1000);
  const currentHour = localTime.getUTCHours();

  const getRecommendation = () => {
    // 1. Stormy
    if (condition === 'Thunderstorm' || condition === 'Tornado') {
      return {
        text: "It's stormy. Stay indoors and safe.",
        icon: <WiStars className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
        type: 'warning'
      };
    }
    // 2. Rain
    if (condition === 'Rain' || condition === 'Drizzle') {
      return {
        text: "Don't forget an umbrella!",
        icon: <WiHumidity className="w-6 h-6 text-blue-600 dark:text-blue-300" />,
        type: 'info'
      };
    }
    // 3. Hot
    if (temp > 30) {
      return {
        text: "It's hot! Stay hydrated.",
        icon: <WiDaySunny className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
        type: 'caution'
      };
    }
    // 4. Cold
    if (temp < 10) {
      return {
        text: "It's chilly! Wear a warm jacket.",
        icon: <WiStrongWind className="w-6 h-6 text-blue-600 dark:text-blue-200" />,
        type: 'info'
      };
    }
    // 5. Perfect
    if (temp >= 18 && temp <= 25 && windSpeed < 5 && condition === 'Clear') {
      const isNight = currentHour < 6 || currentHour > 19;
      return {
        text: isNight ? "Perfect night for a walk." : "Great weather for outdoors!",
        icon: isNight 
          ? <WiMoonAltWaxingCrescent3 className="w-6 h-6 text-purple-600 dark:text-purple-300" /> 
          : <WiDaySunny className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />,
        type: 'good'
      };
    }

    // Default
    return {
      text: `Current: ${main.temp.toFixed(0)}°C and ${condition}.`,
      icon: <Activity className="w-6 h-6 text-gray-600 dark:text-gray-300" />,
      type: 'neutral'
    };
  };

  const rec = getRecommendation();

  // Dynamic Styles (Light Mode Friendly vs Dark Mode Glass)
  const getStyles = () => {
    switch (rec.type) {
      case 'warning': return 'bg-yellow-100/80 dark:bg-yellow-900/30 border-yellow-500/50 text-gray-900 dark:text-yellow-50';
      case 'good':    return 'bg-green-100/80 dark:bg-green-900/30 border-green-500/50 text-gray-900 dark:text-green-50';
      case 'caution': return 'bg-orange-100/80 dark:bg-orange-900/30 border-orange-500/50 text-gray-900 dark:text-orange-50';
      case 'info':    return 'bg-blue-100/80 dark:bg-blue-900/30 border-blue-500/50 text-gray-900 dark:text-blue-50';
      default:        return 'bg-white/60 dark:bg-white/10 border-gray-400/30 text-gray-900 dark:text-gray-100';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`relative w-full px-6 py-3 rounded-full backdrop-blur-md border ${getStyles()} shadow-sm flex items-center justify-between group`}
        >
          <div className="flex items-center space-x-3">
            {rec.icon}
            <p className="font-medium text-sm sm:text-base">
              {rec.text}
            </p>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors opacity-60 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WeatherRecommendations;