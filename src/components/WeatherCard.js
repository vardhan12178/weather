import React, { useState } from 'react';
import { BarChart2, Clock, Droplet, List, RefreshCw, Star, Wind } from 'react-feather';
import WeatherIcon from './WeatherIcon';
import WeatherAlerts from './WeatherAlerts';
import WeatherRecommendations from './WeatherRecommendations';
import HourlyTemperature from './HourlyTemperature';
import TemperatureChart from './TemperatureChart';
import PrecipitationChart from './PrecipitationChart';
import WeatherForecast from './WeatherForecast';

const getAQIStatus = (index) => {
  const statuses = {
    1: { label: 'Good', color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
    2: { label: 'Fair', color: 'bg-lime-500', text: 'text-lime-700 dark:text-lime-300' },
    3: { label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
    4: { label: 'Poor', color: 'bg-orange-500', text: 'text-orange-700 dark:text-orange-300' },
    5: { label: 'Very poor', color: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
  };
  return statuses[index] || { label: 'Unavailable', color: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-300' };
};

const formatLocationDate = (timestamp, timezone) =>
  new Date((timestamp + timezone) * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

const formatLocationTime = (timezone) =>
  new Date(Date.now() + timezone * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });

const WeatherCard = ({
  weatherData,
  forecastData,
  aqi,
  unit,
  toggleUnit,
  refreshWeather,
  isRefreshing,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  favorites,
}) => {
  const [viewMode, setViewMode] = useState('list');
  if (!weatherData) return null;

  const { name, weather, main, wind, dt, sys, timezone } = weatherData;
  const summary = weather[0];
  const isMetric = unit === 'metric';
  const aqiStatus = getAQIStatus(aqi?.main?.aqi);
  const favoriteLimitReached = !isFavorite && favorites?.length >= 6;

  const handleFavorite = () => {
    if (isFavorite) removeFromFavorites(name);
    else addToFavorites(weatherData);
  };

  return (
    <div className="weather-primary-flow">
      <section className="weather-content-section weather-hero-section" aria-labelledby="current-weather-heading">
        <div className="relative p-5 sm:p-7 lg:p-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-300/10" />

          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{formatLocationDate(dt, timezone)}</p>
              <h1 id="current-weather-heading" className="mt-2 flex flex-wrap items-baseline gap-x-2 text-3xl font-black tracking-[-0.055em] text-slate-950 dark:text-white sm:text-5xl">
                <span>{name}</span>
                {sys.country && <span className="text-lg font-bold tracking-normal text-slate-400 dark:text-slate-500">, {sys.country}</span>}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5"><Clock size={13} /> Local time {formatLocationTime(timezone)}</span>
                <span>Updated moments ago</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={toggleUnit} className="premium-icon-button font-extrabold" aria-label={isMetric ? 'Switch to Fahrenheit' : 'Switch to Celsius'}>
                °{isMetric ? 'F' : 'C'}
              </button>
              <button type="button" onClick={refreshWeather} className="premium-icon-button" aria-label="Refresh weather" disabled={isRefreshing}>
                <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
              <button type="button" onClick={handleFavorite} className={`premium-icon-button ${isFavorite ? 'border-amber-300 bg-amber-300 text-amber-950 dark:bg-amber-300 dark:text-amber-950' : ''}`} aria-label={isFavorite ? 'Remove from saved places' : 'Save this place'} disabled={favoriteLimitReached} title={favoriteLimitReached ? 'You can save up to 6 places' : undefined}>
                <Star size={17} className={isFavorite ? 'fill-current' : ''} />
              </button>
            </div>
          </div>

          <div className="relative mt-8 grid items-center gap-7 md:grid-cols-[minmax(0,1.15fr)_minmax(290px,.85fr)] lg:mt-10">
            <div className="flex items-center gap-3 sm:gap-7">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center sm:h-40 sm:w-40">
                <span className="absolute inset-3 rounded-full bg-white/45 blur-2xl dark:bg-sky-300/10" />
                <WeatherIcon code={summary.icon} size={144} className="relative h-28 w-28 drop-shadow-xl sm:h-40 sm:w-40" />
              </div>
              <div className="min-w-0">
                <div className="flex items-start text-slate-950 dark:text-white">
                  <span className="tnum text-[5.5rem] font-black leading-[.82] tracking-[-0.09em] sm:text-[7.5rem]">{Math.round(main.temp)}</span>
                  <span className="mt-1 text-4xl font-light text-slate-400 sm:text-5xl">°</span>
                </div>
                <p className="mt-4 text-lg font-bold capitalize tracking-tight text-slate-800 dark:text-slate-100 sm:text-xl">{summary.description}</p>
              </div>
            </div>

            <div className="weather-quick-grid">
              <div className="weather-quick-stat">
                <span>Feels like</span>
                <strong>{Math.round(main.feels_like)}°</strong>
              </div>
              <div className="weather-quick-stat">
                <span>High / low</span>
                <strong>{Math.round(main.temp_max)}° <em>/</em> {Math.round(main.temp_min)}°</strong>
              </div>
              <div className="weather-quick-stat">
                <span className="inline-flex items-center gap-1.5"><Droplet size={12} /> Humidity</span>
                <strong>{main.humidity}%</strong>
              </div>
              <div className="weather-quick-stat">
                <span className="inline-flex items-center gap-1.5"><Wind size={12} /> Wind</span>
                <strong>{Math.round(wind.speed)} <small>{isMetric ? 'm/s' : 'mph'}</small></strong>
              </div>
            </div>
          </div>

          <div className="relative mt-7 grid gap-3">
            <WeatherAlerts weatherData={weatherData} unit={unit} />
            <WeatherRecommendations weatherData={weatherData} unit={unit} />
          </div>

          {aqi && (
            <div className="relative mt-5 flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/60 bg-white/45 p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${aqiStatus.color}`} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Air quality</p>
                  <p className={`text-sm font-extrabold ${aqiStatus.text}`}>{aqiStatus.label} <span className="font-semibold text-slate-500 dark:text-slate-400">· EU AQI {aqi.main.value}</span></p>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {[
                  ['pm2_5', 'PM₂.₅'],
                  ['pm10', 'PM₁₀'],
                  ['no2', 'NO₂'],
                  ['o3', 'O₃'],
                ].map(([key, label]) => aqi.components[key] != null && (
                  <span key={key} className="shrink-0 rounded-full bg-slate-950/5 px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{label} <strong className="ml-1 text-slate-950 dark:text-white">{Math.round(aqi.components[key])}</strong></span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {forecastData && (
        <section className="weather-content-section p-5 sm:p-7 lg:p-9" aria-labelledby="hourly-heading">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="section-eyebrow">Forecast</p>
              <h2 id="hourly-heading" className="section-title">Next 24 hours</h2>
            </div>
            <div className="view-switcher" aria-label="Hourly forecast view">
              <button type="button" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'is-active' : ''} aria-label="Show hourly cards" aria-pressed={viewMode === 'list'}><List size={17} /></button>
              <button type="button" onClick={() => setViewMode('chart')} className={viewMode === 'chart' ? 'is-active' : ''} aria-label="Show hourly charts" aria-pressed={viewMode === 'chart'}><BarChart2 size={17} /></button>
            </div>
          </div>
          {viewMode === 'list' ? (
            <HourlyTemperature forecastData={forecastData} isDay={weatherData.isDay} textColor="text-slate-950 dark:text-white" textSubColor="text-slate-500 dark:text-slate-400" />
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              <TemperatureChart forecastData={forecastData} unit={unit} />
              <PrecipitationChart forecastData={forecastData} />
            </div>
          )}
        </section>
      )}

      {forecastData && (
        <section className="weather-content-section p-5 sm:p-7 lg:p-9" aria-label="7-day weather outlook">
          <WeatherForecast forecastData={forecastData} currentTemp={main.temp} textColor="text-slate-950 dark:text-white" textSubColor="text-slate-500 dark:text-slate-400" />
        </section>
      )}
    </div>
  );
};

export default WeatherCard;
