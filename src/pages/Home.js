import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useWeatherData } from '../hooks/useWeatherData';
import WeatherDashboard from '../components/WeatherDashboard';
import WeatherScene from '../components/Scene/WeatherScene';

const Home = () => {
  const weatherState = useWeatherData();
  const { weatherData } = weatherState;

  let isDay = true;
  if (weatherData) {
    const { dt, sys } = weatherData;
    isDay = dt > sys.sunrise && dt < sys.sunset;
  }
  const darkMode = !isDay;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      return;
    }
    document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const condition = weatherData?.weather?.[0]?.main || 'Clear';

  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950';
    if (!isDay) return 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950';

    switch (condition) {
      case 'Clear':
        return 'bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500';
      case 'Clouds':
        return 'bg-gradient-to-br from-slate-200 via-slate-300 to-blue-200';
      case 'Rain':
      case 'Drizzle':
        return 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800';
      case 'Thunderstorm':
        return 'bg-gradient-to-br from-slate-700 via-slate-900 to-black';
      case 'Snow':
        return 'bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200';
      case 'Mist':
      case 'Fog':
      case 'Haze':
        return 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500';
      default:
        return 'bg-gradient-to-br from-sky-500 via-blue-500 to-blue-700';
    }
  };

  return (
    <div className={`relative w-full min-h-screen overflow-hidden transition-all duration-1000 ${getBackgroundClass()}`}>
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <WeatherScene condition={condition} isDay={isDay} />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.35),rgba(255,255,255,0)_45%)]" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/0 via-black/0 to-black/30" />

      <div className="relative z-10">
        <WeatherDashboard
          data={weatherState}
          setLocation={weatherState.setLocation}
          setCoordinates={weatherState.setCoordinates}
          darkMode={darkMode}
          unit={weatherState.unit}
          toggleUnit={weatherState.toggleUnit}
          favorites={weatherState.favorites}
          addToFavorites={weatherState.addToFavorites}
          removeFromFavorites={weatherState.removeFromFavorites}
        />
      </div>
    </div>
  );
};

export default Home;
