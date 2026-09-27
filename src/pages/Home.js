import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useWeatherData } from '../hooks/useWeatherData';
import WeatherDashboard from '../components/WeatherDashboard';
import WeatherScene from '../components/Scene/WeatherScene';
import ErrorBoundary from '../components/ErrorBoundary';

const Home = () => {
  const weatherState = useWeatherData();
  const { weatherData } = weatherState;

  // Day/night comes straight from the API for the searched location
  const isDay = weatherData ? weatherData.isDay : true;
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
    if (!weatherData) return 'bg-gradient-to-b from-sky-100 via-blue-50 to-indigo-100';
    if (!isDay) return 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900';

    switch (condition) {
      case 'Clear':
        return 'bg-gradient-to-b from-sky-300 via-sky-200 to-indigo-100';
      case 'Clouds':
        return 'bg-gradient-to-b from-slate-300 via-slate-200 to-blue-100';
      case 'Rain':
      case 'Drizzle':
        return 'bg-gradient-to-b from-slate-400 via-slate-300 to-sky-200';
      case 'Thunderstorm':
        return 'bg-gradient-to-b from-slate-500 via-slate-400 to-indigo-300';
      case 'Snow':
        return 'bg-gradient-to-b from-sky-100 via-blue-50 to-slate-100';
      case 'Mist':
      case 'Fog':
      case 'Haze':
        return 'bg-gradient-to-b from-slate-200 via-slate-100 to-blue-100';
      default:
        return 'bg-gradient-to-b from-sky-300 via-sky-200 to-blue-200';
    }
  };

  return (
    <div className={`relative w-full min-h-screen overflow-hidden transition-all duration-1000 ${getBackgroundClass()}`}>
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isDay ? 'opacity-80' : 'opacity-95'}`}>
        {/* The 3D backdrop is decorative: if it fails (e.g. the cloud texture can't
            be downloaded), drop it and keep the forecast on screen. */}
        <ErrorBoundary fallback={null}>
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <WeatherScene condition={condition} isDay={isDay} />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Soft light bloom + gentle vignette so content reads cleanly over the sky */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.45),rgba(255,255,255,0)_55%)]" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-white/0 via-white/0 to-black/10 dark:to-black/25" />

      <div className="relative z-10">
        <WeatherDashboard
          data={weatherState}
          setLocation={weatherState.setLocation}
          setCoordinates={weatherState.setCoordinates}
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
