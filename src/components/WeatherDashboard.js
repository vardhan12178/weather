import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, List } from 'react-feather';
import Header from './Header';
import WeatherCard from './WeatherCard';
import WeatherForecast from './WeatherForecast';
import HourlyTemperature from './HourlyTemperature';
import WeatherAlerts from './WeatherAlerts';
import Footer from './Footer';
import NotFound from './NotFound';
import FavoritesList from './FavoritesList';
import WeatherStats from './WeatherStats';
import TemperatureChart from './TemperatureChart';
import PrecipitationChart from './PrecipitationChart';

const formatLocalTime = (timezoneOffset = 0) => {
  const localTime = new Date(Date.now() + timezoneOffset * 1000);
  return localTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
};

const SkeletonCard = () => (
  <div className="w-full animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 h-[26rem] rounded-[2rem] bg-white/35" />
      <div className="lg:col-span-4 h-[26rem] rounded-[2rem] bg-white/25" />
    </div>
    <div className="mt-6 h-[16rem] rounded-[2rem] bg-white/25" />
  </div>
);

const WeatherDashboard = ({
  data,
  setLocation,
  setCoordinates,
  darkMode,
  unit,
  toggleUnit,
  favorites,
  addToFavorites,
  removeFromFavorites
}) => {
  const { weatherData, forecastData, aqi, coordinates, loading, error } = data;
  const [viewMode, setViewMode] = useState('list');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
  };

  let isDay = true;
  if (weatherData) {
    const { dt, sys } = weatherData;
    isDay = dt > sys.sunrise && dt < sys.sunset;
  }

  const glassClass = isDay
    ? 'bg-white/68 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.15)]'
    : 'bg-slate-950/35 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(2,6,23,0.55)]';
  const textColor = isDay ? 'text-slate-900' : 'text-slate-100';
  const textSubColor = isDay ? 'text-slate-600' : 'text-slate-300';

  return (
    <div className="relative z-10 h-screen flex flex-col overflow-hidden">
      <Header setLocation={setLocation} setCoordinates={setCoordinates} darkMode={darkMode} />

      <main className="flex-grow w-full overflow-y-auto overflow-x-hidden flex flex-col items-center pb-12 px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="w-full max-w-7xl mt-8">
            <div className={`mb-8 inline-flex items-center gap-3 px-5 py-3 rounded-full ${glassClass}`}>
              <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span className={`${textColor} text-sm font-semibold tracking-wide`}>Fetching live weather data</span>
            </div>
            <SkeletonCard />
          </div>
        )}

        {!loading && error && (
          <div className="z-50 w-full h-full flex items-center justify-center p-4">
            <NotFound />
          </div>
        )}

        {!loading && !error && weatherData && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="w-full max-w-7xl mt-4 sm:mt-6">
            <motion.div variants={itemVariants} className="mb-6">
              <div className={`${glassClass} rounded-2xl px-4 py-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-center sm:text-left`}>
                <span className={`${textColor} text-sm font-semibold`}>
                  {weatherData.name}, {weatherData.sys?.country}
                </span>
                <span className={`${textSubColor} text-xs font-medium uppercase tracking-wider`}>
                  Local time {formatLocalTime(weatherData.timezone)}
                </span>
                <span className={`${textSubColor} text-xs font-medium uppercase tracking-wider`}>
                  {coordinates?.lat && coordinates?.lon
                    ? `Lat ${coordinates.lat.toFixed(2)} | Lon ${coordinates.lon.toFixed(2)}`
                    : 'Using current location'}
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full mb-6">
              <WeatherAlerts weatherData={weatherData} unit={unit} />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              <div className={`lg:col-span-8 rounded-[2rem] p-4 sm:p-6 ${glassClass}`}>
                <WeatherCard
                  weatherData={weatherData}
                  aqi={aqi}
                  setCoordinates={setCoordinates}
                  unit={unit}
                  toggleUnit={toggleUnit}
                  isFavorite={favorites.some((fav) => fav.name === weatherData.name)}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                  favorites={favorites}
                  textColor={textColor}
                  glassClass={glassClass}
                />
              </div>

              <div className="lg:col-span-4 flex flex-col gap-4">
                {favorites?.length > 0 && (
                  <div className={`w-full rounded-[2rem] p-4 ${glassClass}`}>
                    <FavoritesList favorites={favorites} setLocation={setLocation} removeFromFavorites={removeFromFavorites} />
                  </div>
                )}

                <div className={`w-full rounded-[2rem] p-5 overflow-hidden flex flex-col ${glassClass}`}>
                  <WeatherForecast forecastData={forecastData} textColor={textColor} textSubColor={textSubColor} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <WeatherStats weatherData={weatherData} unit={unit} glassClass={glassClass} textColor={textColor} textSubColor={textSubColor} />

              <div className={`w-full rounded-[2rem] p-5 sm:p-6 ${glassClass}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`${textColor} font-bold text-xs uppercase tracking-widest opacity-70`}>Next 24 Hours</h3>
                  <div className="flex gap-1 bg-black/5 dark:bg-white/10 rounded-full p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-full transition-all ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-300 shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-300'
                      }`}
                      title="List view"
                    >
                      <List size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('chart')}
                      className={`p-2 rounded-full transition-all ${
                        viewMode === 'chart'
                          ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-300 shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-300'
                      }`}
                      title="Chart view"
                    >
                      <BarChart2 size={18} />
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
            </motion.div>

            <div className="w-full pt-8">
              <Footer />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WeatherDashboard;
