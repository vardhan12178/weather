import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import WeatherCard from './WeatherCard';
import Footer from './Footer';
import NotFound from './NotFound';
import FavoritesList from './FavoritesList';
import WeatherStats from './WeatherStats';

const SkeletonCard = () => (
  <div className="w-full animate-pulse">
    <div className="flex flex-col gap-6">
      <div className="w-full h-[32rem] rounded-[2.5rem] bg-white/35" />
      <div className="w-full h-[18rem] rounded-[2.5rem] bg-white/25" />
    </div>
  </div>
);

const WeatherDashboard = ({
  data,
  setLocation,
  setCoordinates,
  unit,
  toggleUnit,
  favorites,
  addToFavorites,
  removeFromFavorites
}) => {
  const { weatherData, forecastData, aqi, loading, error, refresh, refreshing } = data;

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

  const isDay = weatherData ? weatherData.isDay : true;

  // Mobile borderless: styles are card-like only on medium screens and up (md:prefix)
  const mainCardClass = isDay
    ? 'md:bg-white/70 md:backdrop-blur-2xl md:border md:border-white/60 md:shadow-[0_20px_60px_rgba(15,23,42,0.12)] rounded-[2.5rem]'
    : 'md:bg-slate-950/35 md:backdrop-blur-2xl md:border md:border-white/15 md:shadow-[0_20px_60px_rgba(2,6,23,0.5)] rounded-[2.5rem]';
  
  const textColor = isDay ? 'text-slate-900' : 'text-slate-100';
  const textSubColor = isDay ? 'text-slate-600' : 'text-slate-300';

  return (
    <div className="relative z-10 h-screen flex flex-col overflow-hidden">
      <Header setLocation={setLocation} setCoordinates={setCoordinates} />

      <main className="flex-grow w-full overflow-y-auto overflow-x-hidden flex flex-col items-center pb-12 px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="w-full max-w-4xl mt-8">
            <div className={`mb-8 inline-flex items-center gap-3 px-5 py-3 rounded-full md:bg-white/30 backdrop-blur-xl border border-white/20`}>
              <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span className={`${textColor} text-sm font-semibold tracking-wide`}>Fetching live weather data</span>
            </div>
            <SkeletonCard />
          </div>
        )}

        {!loading && error && (
          <div className="z-50 w-full h-full flex items-center justify-center p-4">
            <NotFound type={error} setLocation={setLocation} />
          </div>
        )}

        {!loading && !error && weatherData && (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="w-full max-w-4xl mt-4 sm:mt-6 flex flex-col gap-6"
          >
            {/* 1. Saved Places (Favorites) horizontal scroll bar */}
            {favorites?.length > 0 && (
              <motion.div variants={itemVariants} className={`p-4 sm:p-5 overflow-hidden ${mainCardClass}`}>
                <FavoritesList favorites={favorites} unit={unit} setLocation={setLocation} removeFromFavorites={removeFromFavorites} />
              </motion.div>
            )}

            {/* 2. Unified Hero Weather Sheet (Current conditions, alerts, AQI, Hourly, and 5-Day Outlook) */}
            <motion.div variants={itemVariants} className={`p-4 sm:p-7 md:p-8 ${mainCardClass}`}>
              <WeatherCard
                weatherData={weatherData}
                forecastData={forecastData}
                aqi={aqi}
                onRefresh={refresh}
                refreshing={refreshing}
                unit={unit}
                toggleUnit={toggleUnit}
                isFavorite={favorites.some((fav) => fav.name === weatherData.name)}
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                favorites={favorites}
                textColor={textColor}
                textSubColor={textSubColor}
                isDay={isDay}
              />
            </motion.div>

            {/* 3. Unified Weather Intelligence Hub (Stats details grid & Sun Arc) */}
            <motion.div variants={itemVariants}>
              <WeatherStats 
                weatherData={weatherData} 
                unit={unit} 
                mainCardClass={mainCardClass} 
                textColor={textColor} 
                textSubColor={textSubColor} 
              />
            </motion.div>
            
            <div className="w-full pt-4">
              <Footer />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WeatherDashboard;
