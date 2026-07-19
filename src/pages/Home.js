import React, { useEffect } from 'react';
import { useWeatherData } from '../hooks/useWeatherData';
import WeatherDashboard from '../components/WeatherDashboard';

const getTheme = (condition, isDay) => {
  if (!isDay) return 'weather-shell--night';
  if (['Rain', 'Drizzle', 'Thunderstorm'].includes(condition)) return 'weather-shell--rain';
  if (['Clouds', 'Fog', 'Mist', 'Haze'].includes(condition)) return 'weather-shell--clouds';
  if (condition === 'Snow') return 'weather-shell--snow';
  return 'weather-shell--clear';
};

const Home = () => {
  const weatherState = useWeatherData();
  const { weatherData } = weatherState;
  const isDay = weatherData?.isDay ?? true;
  const condition = weatherData?.weather?.[0]?.condition || 'Clear';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', !isDay);
  }, [isDay]);

  return (
    <div className={`weather-shell ${getTheme(condition, isDay)}`}>
      <div className="weather-atmosphere" aria-hidden="true">
        <span className="weather-orb weather-orb--one" />
        <span className="weather-orb weather-orb--two" />
        <span className="weather-grain" />
      </div>
      <WeatherDashboard
        data={weatherState}
        setLocation={weatherState.setLocation}
        setCoordinates={weatherState.setCoordinates}
        unit={weatherState.unit}
        toggleUnit={weatherState.toggleUnit}
        favorites={weatherState.favorites}
        addToFavorites={weatherState.addToFavorites}
        removeFromFavorites={weatherState.removeFromFavorites}
        refreshWeather={weatherState.refreshWeather}
      />
    </div>
  );
};

export default Home;
