import React from 'react'; // Removed useState/useEffect for theme
import { Canvas } from '@react-three/fiber';
import { useWeatherData } from './hooks/useWeatherData';
import WeatherDashboard from './components/WeatherDashboard';
import WeatherScene from './components/Scene/WeatherScene';

const App = () => {
  const weatherState = useWeatherData();
  const { weatherData } = weatherState;

  // 1. Calculate Day/Night Status
  let isDay = true; // Default to Day (Light Mode)
  
  if (weatherData) {
    const { dt, sys } = weatherData;
    isDay = dt > sys.sunrise && dt < sys.sunset;
  }

  // 2. Force Dark Mode if it's Night
  const darkMode = !isDay; 

  // 3. Sync HTML class for Tailwind (optional, but good practice)
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const condition = weatherData?.weather?.[0]?.main || 'Clear';

  return (
    <div className="relative w-full min-h-screen overflow-hidden transition-colors duration-1000 bg-gray-100 dark:bg-gray-900">
      
      {/* Layer 1: 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <WeatherScene condition={condition} isDay={isDay} />
        </Canvas>
      </div>

      {/* Layer 2: UI Overlay */}
      <WeatherDashboard 
        data={weatherState}
        setLocation={weatherState.setLocation}
        setCoordinates={weatherState.setCoordinates}
        darkMode={darkMode}
        // Removed toggleDarkMode prop
      />
    </div>
  );
};

export default App;