import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import WeatherCard from './WeatherCard';
import WeatherStats from './WeatherStats';
import FavoritesList from './FavoritesList';
import NotFound from './NotFound';
import Footer from './Footer';

const WeatherSkeleton = () => (
  <div className="weather-dashboard-frame mx-auto w-full max-w-7xl animate-pulse">
    <div className="weather-dashboard-grid min-h-[680px]">
      <div className="bg-white/20 dark:bg-white/[.03]" />
      <div className="border-l border-white/40 bg-white/15 dark:border-white/10 dark:bg-white/[.02]" />
    </div>
  </div>
);

const WeatherDashboard = ({
  data,
  setLocation,
  setCoordinates,
  unit,
  toggleUnit,
  favorites = [],
  addToFavorites,
  removeFromFavorites,
  refreshWeather,
}) => {
  const { weatherData, forecastData, aqi, loading, error } = data;

  return (
    <div id="top" className="relative z-10 min-h-screen">
      <Header setLocation={setLocation} setCoordinates={setCoordinates} />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-8 sm:px-6 lg:px-8">
        {loading && !weatherData && <WeatherSkeleton />}

        {!loading && error && !weatherData && (
          <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
            <NotFound message={error} setLocation={setLocation} onRetry={refreshWeather} />
          </div>
        )}

        {weatherData && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mx-auto w-full max-w-7xl py-6 sm:py-8">
            {error && (
              <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-amber-300/50 bg-amber-50/80 px-4 py-3 text-sm font-semibold text-amber-900 backdrop-blur dark:border-amber-300/20 dark:bg-amber-950/40 dark:text-amber-100" role="status">
                <span>{error} Showing the most recent result.</span>
                <button type="button" onClick={refreshWeather} className="shrink-0 underline underline-offset-4">Retry</button>
              </div>
            )}

            {favorites.length > 0 && (
              <section className="mb-6" aria-label="Saved places">
                <FavoritesList favorites={favorites} setLocation={setLocation} removeFromFavorites={removeFromFavorites} />
              </section>
            )}

            <div className="weather-dashboard-frame">
              <div className="weather-dashboard-grid">
              <WeatherCard
                weatherData={weatherData}
                forecastData={forecastData}
                aqi={aqi}
                unit={unit}
                toggleUnit={toggleUnit}
                refreshWeather={refreshWeather}
                isRefreshing={loading}
                isFavorite={favorites.some((favorite) => favorite.name === weatherData.name && favorite.country === weatherData.sys.country)}
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                favorites={favorites}
              />

              <aside className="weather-details-rail">
                <WeatherStats weatherData={weatherData} unit={unit} mainCardClass="" textColor="text-slate-950 dark:text-white" textSubColor="text-slate-500 dark:text-slate-400" />
              </aside>
              </div>
            </div>

            <Footer />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WeatherDashboard;
