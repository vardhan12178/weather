import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Thermometer, Wind, CloudRain, Eye, Sun, X } from 'react-feather';
import { toCelsius, toMetersPerSecond, tempUnitLabel, windUnitLabel } from '../utils/units';

const WeatherAlerts = ({ weatherData, unit = 'metric' }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!weatherData || !isVisible) return null;

  const { main, wind, weather, visibility, uvIndex } = weatherData;
  const condition = weather[0].main;
  const tempC = toCelsius(main.temp, unit);
  const windMs = toMetersPerSecond(wind.speed, unit);
  const unitLabel = tempUnitLabel(unit);
  const displayTemp = Math.round(main.temp);

  // Indian season detection (month 1-12)
  const month = new Date().getMonth() + 1;
  const isMonsoonSeason = month >= 6 && month <= 9;
  const isWinterFogSeason = month === 12 || month <= 2; // Dec–Feb

  const getAlert = () => {
    // ── Severe weather first ─────────────────────────────────────────────────
    if (condition === 'Thunderstorm' || condition === 'Tornado') {
      return {
        title: 'Severe Weather Advisory',
        message: 'Thunderstorms detected nearby. Avoid open areas, tall trees, and flooded roads.',
        icon: <AlertTriangle size={16} />,
        classes: 'bg-amber-100/85 dark:bg-amber-900/35 text-amber-900 dark:text-amber-100 border-amber-400/70',
      };
    }

    // ── Indian extreme heat wave (≥40°C) ────────────────────────────────────
    if (tempC >= 40) {
      return {
        title: 'Heat Wave Alert 🌡️',
        message: `Extreme heat: ${displayTemp}°${unitLabel}. Avoid going out between 11 am – 4 pm. Drink plenty of fluids and wear light clothing.`,
        icon: <Thermometer size={16} />,
        classes: 'bg-red-100/85 dark:bg-red-900/35 text-red-900 dark:text-red-100 border-red-400/70',
      };
    }

    // ── Standard heat advisory ───────────────────────────────────────────────
    if (tempC >= 35) {
      return {
        title: 'Heat Advisory',
        message: `Temperature is ${displayTemp}°${unitLabel}. Stay hydrated and limit direct sun exposure.`,
        icon: <Thermometer size={16} />,
        classes: 'bg-orange-100/85 dark:bg-orange-900/35 text-orange-900 dark:text-orange-100 border-orange-400/70',
      };
    }

    // ── Freeze advisory ──────────────────────────────────────────────────────
    if (tempC < 0) {
      return {
        title: 'Freeze Advisory',
        message: `Temperature is ${displayTemp}°${unitLabel}. Roads and surfaces may be icy and slippery.`,
        icon: <Thermometer size={16} />,
        classes: 'bg-sky-100/85 dark:bg-sky-900/35 text-sky-900 dark:text-sky-100 border-sky-400/70',
      };
    }

    // ── Indian monsoon season + rain ─────────────────────────────────────────
    if (isMonsoonSeason && (condition === 'Rain' || condition === 'Drizzle')) {
      return {
        title: 'Monsoon Active 🌧️',
        message: 'Active monsoon rainfall. Watch for waterlogging, flash floods, and landslides in hilly areas.',
        icon: <CloudRain size={16} />,
        classes: 'bg-blue-100/85 dark:bg-blue-900/35 text-blue-900 dark:text-blue-100 border-blue-400/70',
      };
    }

    // ── Dust / Sand storm ─────────────────────────────────────────────────────
    if (condition === 'Dust' || condition === 'Sand' || condition === 'Ash') {
      return {
        title: 'Dust Storm Warning 🌪️',
        message: 'Dust / sand storm in progress. Wear a mask outdoors, keep windows closed, and avoid driving.',
        icon: <Wind size={16} />,
        classes: 'bg-yellow-100/85 dark:bg-yellow-900/35 text-yellow-900 dark:text-yellow-100 border-yellow-400/70',
      };
    }

    // ── Dense fog (North India winter) ───────────────────────────────────────
    if (
      isWinterFogSeason &&
      (condition === 'Fog' || condition === 'Mist') &&
      (visibility !== undefined && visibility < 500)
    ) {
      return {
        title: 'Dense Fog Advisory 🌫️',
        message: 'Visibility below 500 m. Use fog lights, reduce speed, and maintain extra distance while driving.',
        icon: <Eye size={16} />,
        classes: 'bg-slate-100/85 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 border-slate-400/70',
      };
    }

    // ── Haze / smoke ─────────────────────────────────────────────────────────
    if ((condition === 'Haze' || condition === 'Smoke') && visibility !== undefined && visibility < 2000) {
      return {
        title: 'Haze / Poor Visibility',
        message: 'Reduced visibility due to haze or smoke. People with respiratory conditions should stay indoors.',
        icon: <Eye size={16} />,
        classes: 'bg-slate-100/85 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 border-slate-400/70',
      };
    }

    // ── High winds ───────────────────────────────────────────────────────────
    if (windMs > 15) {
      return {
        title: 'High Wind Advisory',
        message: `Wind speeds near ${Math.round(wind.speed)} ${windUnitLabel(unit)}. Secure lightweight objects and avoid exposed areas.`,
        icon: <Wind size={16} />,
        classes: 'bg-orange-100/85 dark:bg-orange-900/35 text-orange-900 dark:text-orange-100 border-orange-400/70',
      };
    }

    // ── Regular rain reminder ────────────────────────────────────────────────
    if (condition === 'Rain' || condition === 'Drizzle') {
      return {
        title: 'Rain Expected',
        message: 'Carry an umbrella and allow extra travel time if heading out.',
        icon: <CloudRain size={16} />,
        classes: 'bg-blue-100/85 dark:bg-blue-900/35 text-blue-900 dark:text-blue-100 border-blue-400/70',
      };
    }

    // ── Extreme UV (Open-Meteo provides this; OWM did not) ───────────────────
    if (uvIndex != null && uvIndex >= 11) {
      return {
        title: 'Extreme UV Alert ☀️',
        message: `UV Index ${Math.round(uvIndex)} — extreme radiation. Avoid all outdoor exposure between 10 am – 4 pm. Wear SPF 50+, sunglasses, and a hat.`,
        icon: <Sun size={16} />,
        classes: 'bg-purple-100/85 dark:bg-purple-900/35 text-purple-900 dark:text-purple-100 border-purple-400/70',
      };
    }
    if (uvIndex != null && uvIndex >= 8) {
      return {
        title: 'Very High UV Warning',
        message: `UV Index ${Math.round(uvIndex)} — very high. Apply sunscreen, seek shade during midday, and wear protective clothing.`,
        icon: <Sun size={16} />,
        classes: 'bg-orange-100/85 dark:bg-orange-900/35 text-orange-900 dark:text-orange-100 border-orange-400/70',
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
          <span className="mt-0.5 shrink-0">{alert.icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">{alert.title}</p>
            <p className="text-sm font-medium mt-0.5 leading-snug">{alert.message}</p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="opacity-60 hover:opacity-100 transition-opacity shrink-0 mt-0.5"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherAlerts;
