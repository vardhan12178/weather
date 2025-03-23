// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import WeatherForecast from './components/WeatherForecast';
import Footer from './components/Footer';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherRecommendations from './components/WeatherRecommendations';
import NotFound from './components/NotFound';
import HourlyTemperature from './components/HourlyTemperature';
import RainEffect from './effects/RainEffect';
import SnowEffect from './effects/SnowEffect';
import SunnyEffect from './effects/SunnyEffect';
import CloudyEffect from './effects/CloudyEffect';
import HazeEffect from './effects/HazeEffect'; // New
import MistEffect from './effects/MistEffect'; // New
import FogEffect from './effects/FogEffect'; // New
import SmokeEffect from './effects/SmokeEffect'; // New
import DustEffect from './effects/DustEffect'; // New
import SandEffect from './effects/SandEffect'; // New
import AshEffect from './effects/AshEffect'; // New
import SquallEffect from './effects/SquallEffect'; // New
import TornadoEffect from './effects/TornadoEffect'; // New

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const clearLocationData = () => {
    setCoordinates({ lat: null, lon: null });
    setWeatherData(null);
  };

  useEffect(() => {
    const fetchWeatherByLocation = async (lat, lon) => {
      try {
        setError('');
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`
        );
        setWeatherData(response.data);
      } catch (err) {
        setWeatherData(null);
        setError('Unable to fetch weather data for your location.');
      } finally {
        setLoading(false);
      }
    };

    if (coordinates.lat !== null && coordinates.lon !== null) {
      fetchWeatherByLocation(coordinates.lat, coordinates.lon);
    }
  }, [coordinates]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (location.trim() === '') return;
      try {
        setError('');
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`
        );
        setWeatherData(response.data);
        setCoordinates({ lat: response.data.coord.lat, lon: response.data.coord.lon });
      } catch (err) {
        setWeatherData(null);
        setError('Location not found. Please enter a valid city.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  useEffect(() => {
    clearLocationData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          console.error(err);
          setError('Unable to retrieve your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const renderWeatherEffect = () => {
    const condition = weatherData?.weather?.[0]?.main;
    console.log('Weather condition:', condition);
    switch (condition) {
      case 'Rain':
        return <RainEffect intensity="moderate" />;
      case 'Drizzle':
        return <RainEffect intensity="light" />;
      case 'Thunderstorm':
        return (
          <>
            <RainEffect intensity="heavy" />
            {/* Add a lightning effect (you can create a LightningEffect.js or use CSS) */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="lightning-flash" />
            </div>
          </>
        );
      case 'Snow':
        return <SnowEffect />;
      case 'Clear':
        return <SunnyEffect />;
      case 'Clouds':
        return <CloudyEffect />;
      case 'Haze':
        return <HazeEffect />;
      case 'Mist':
        return <MistEffect />;
      case 'Fog':
        return <FogEffect />;
      case 'Smoke':
        return <SmokeEffect />;
      case 'Dust':
        return <DustEffect />;
      case 'Sand':
        return <SandEffect />;
      case 'Ash':
        return <AshEffect />;
      case 'Squall':
        return <SquallEffect />;
      case 'Tornado':
        return <TornadoEffect />;
      default:
        return null;
    }
  };

  const hasWeatherEffect = !!renderWeatherEffect();

  // Update the default background based on the weather condition
  const getDefaultBackground = () => {
    const condition = weatherData?.weather?.[0]?.main;
    switch (condition) {
      case 'Haze':
      case 'Mist':
      case 'Fog':
      case 'Smoke':
        return 'bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900';
      case 'Dust':
      case 'Sand':
        return 'bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-yellow-900 dark:to-yellow-700';
      case 'Ash':
        return 'bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-800 dark:to-gray-900';
      case 'Squall':
      case 'Tornado':
        return 'bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-900 dark:to-black';
      default:
        return 'bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800';
    }
  };

  return (
    <div
      className={`min-h-screen font-sans relative ${
        !hasWeatherEffect ? getDefaultBackground() : ''
      }`}
    >
      {renderWeatherEffect()}

      <Header
        setLocation={setLocation}
        setCoordinates={setCoordinates}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {loading && (
          <div className="w-full max-w-xl mx-auto mt-4 text-center">
            <p className="text-gray-600 dark:text-gray-300">Loading weather data...</p>
          </div>
        )}
        {error && location && (
          <div className="w-full max-w-xl mx-auto mt-4">
            <NotFound />
          </div>
        )}
        {weatherData && !loading && (
          <div className="space-y-8">
            <WeatherAlerts location={location} coordinates={coordinates} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherCard weatherData={weatherData} setCoordinates={setCoordinates} />
              <HourlyTemperature lat={coordinates.lat} lon={coordinates.lon} />
            </div>
            <WeatherRecommendations location={location} coordinates={coordinates} />
            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 font-poppins">
                5-Day Forecast
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((day) => (
                  <WeatherForecast
                    key={`day${day}`}
                    location={location}
                    coordinates={coordinates}
                    start={day}
                    end={day + 1}
                    hoverEffect={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;