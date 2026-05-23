import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'react-feather';

const WeatherRecommendations = ({ weatherData }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  if (!weatherData || !isVisible) return null;

  const { main, weather, wind, dt, timezone } = weatherData;
  const temp = main.temp; // degrees in current unit (component is unit-agnostic for display)
  const tempC = main.temp; // We receive metric by default; see note below
  const humidity = main.humidity;
  const condition = weather[0].main;
  const windSpeed = wind.speed;

  // Derive local hour (0–23) from Unix timestamp + timezone offset
  const localTime = new Date((dt + timezone) * 1000);
  const currentHour = localTime.getUTCHours();
  const isNight = currentHour < 6 || currentHour >= 20;
  const isEvening = currentHour >= 17 && currentHour < 20;

  const month = new Date().getMonth() + 1;
  const isMonsoonSeason = month >= 6 && month <= 9;
  const isSummer = month >= 3 && month <= 6; // March – June

  const getRecommendation = () => {
    // 1. Severe storm
    if (condition === 'Thunderstorm' || condition === 'Tornado') {
      return { emoji: '⛈️', text: "Severe storm. Stay indoors, unplug electronics, and keep emergency numbers handy." };
    }

    // 2. Dust storm (common in North India summers)
    if (condition === 'Dust' || condition === 'Sand') {
      return { emoji: '🌪️', text: "Dust storm outside. Wear a mask, cover food and water, and keep windows shut." };
    }

    // 3. Dense fog
    if ((condition === 'Fog' || condition === 'Mist') && (month === 12 || month <= 2)) {
      return { emoji: '🌫️', text: "Dense fog expected — a common North India winter morning. Drive slow, use fog lights, and allow extra travel time." };
    }

    // 4. Active monsoon
    if (isMonsoonSeason && (condition === 'Rain' || condition === 'Drizzle')) {
      return { emoji: '☔', text: "Monsoon is active! Carry a rain jacket, watch for waterlogged roads, and check flood alerts before stepping out." };
    }

    // 5. Regular rain
    if (condition === 'Rain' || condition === 'Drizzle') {
      return { emoji: '🌧️', text: "It's raining. Grab an umbrella and watch your step on slippery roads." };
    }

    // 6. Snow
    if (condition === 'Snow') {
      return { emoji: '❄️', text: "Snowfall! Dress in layers, wear non-slip footwear, and drive carefully on icy roads." };
    }

    // 7. Extreme Indian heat wave
    if (tempC >= 42) {
      return { emoji: '🔥', text: "Brutal heat wave conditions. Avoid any outdoor activity. Keep a water bottle handy at all times and check on elderly neighbours." };
    }

    // 8. Hot Indian summer afternoon
    if (isSummer && tempC >= 35 && !isNight) {
      return { emoji: '☀️', text: "Scorching afternoon — peak Indian summer. Stay indoors between 11 am – 4 pm, wear sunscreen SPF 50+, and drink at least 3 litres of water today." };
    }

    // 9. Hot (general)
    if (tempC > 30) {
      return { emoji: '🌡️', text: `It's ${Math.round(temp)}° and hot. Stay hydrated, wear light cotton clothing, and use sunscreen if heading out.` };
    }

    // 10. UV caution (clear + daytime + warm)
    if (condition === 'Clear' && !isNight && tempC > 22) {
      if (isEvening) {
        return { emoji: '🌅', text: "Beautiful clear evening — perfect for a walk or a rooftop hangout." };
      }
      return { emoji: '🕶️', text: "Clear sky and sunny. UV levels will be high around midday — wear sunglasses and sunscreen." };
    }

    // 11. Perfect night / evening
    if (condition === 'Clear' && isNight) {
      return { emoji: '🌙', text: "Clear night sky — a great opportunity for stargazing away from city lights." };
    }

    // 12. Cold
    if (tempC < 10) {
      return { emoji: '🧥', text: "It's chilly! Layer up before heading out, especially if you're on a two-wheeler." };
    }

    // 13. Pleasant conditions (18–28°C, calm)
    if (tempC >= 18 && tempC <= 28 && windSpeed < 5 && condition !== 'Rain') {
      return { emoji: '😊', text: "Lovely weather today — comfortable for outdoor activities, morning walks, or a picnic in the park." };
    }

    // 14. Windy
    if (windSpeed > 10) {
      return { emoji: '💨', text: `Strong winds (~${Math.round(windSpeed)} m/s). Secure loose items outdoors and be careful with kites or canopies!` };
    }

    // 15. High humidity
    if (humidity > 80) {
      return { emoji: '💧', text: `Humidity at ${humidity}% — feels very muggy. Light cotton clothes and regular water intake will help.` };
    }

    // Default
    return { emoji: '🌤️', text: `${Math.round(temp)}° and ${condition.toLowerCase()} outside. Enjoy your day!` };
  };

  const rec = getRecommendation();

  const getRecommendationTheme = (emoji) => {
    switch (emoji) {
      case '🔥':
      case '☀️':
      case '🌅':
      case '🕶️':
      case '🌤️':
        return 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30 dark:from-amber-400/15 dark:via-orange-400/5 dark:border-amber-400/25';
      case '☔':
      case '🌧️':
      case '⛈️':
        return 'from-sky-500/10 via-blue-500/5 to-transparent border-sky-500/30 dark:from-sky-400/15 dark:via-blue-400/5 dark:border-sky-400/25';
      case '❄️':
      case '🧥':
      case '🌫️':
      case '🌪️':
        return 'from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/30 dark:from-indigo-400/15 dark:via-purple-400/5 dark:border-indigo-400/25';
      case '😊':
        return 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30 dark:from-emerald-400/15 dark:via-teal-400/5 dark:border-emerald-400/25';
      default:
        return 'from-slate-500/10 via-slate-500/5 to-transparent border-slate-500/30 dark:from-slate-400/15 dark:border-slate-400/25';
    }
  };

  const themeClass = getRecommendationTheme(rec.emoji);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r ${themeClass} backdrop-blur-md border shadow-soft flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:brightness-105 transition-all duration-300`}
        >
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-grow">
            <span className="text-xl shrink-0 mt-0.5 sm:mt-0 select-none">{rec.emoji}</span>
            <p className={`text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug ${isExpanded ? 'whitespace-normal break-words' : 'truncate'}`}>
              {rec.text}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-center sm:self-auto">
            <span className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors opacity-50 hover:opacity-100"
              aria-label="Dismiss recommendation"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WeatherRecommendations;
