import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import WeatherForecast from './components/WeatherForecast';
import DarkModeToggle from './components/DarkModeToggle';
import Footer from './components/Footer';
import { FaExclamationCircle } from 'react-icons/fa';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherRecommendations from './components/WeatherRecommendations';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [error, setError] = useState('');

  const clearLocationData = () => {
    setCoordinates({ lat: null, lon: null });
    setWeatherData(null);
  };

  useEffect(() => {
    const fetchWeatherByLocation = async (lat, lon) => {
      try {
        setError('');
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`
        );
        setWeatherData(response.data);
      } catch (err) {
        setWeatherData(null);
        setError('Unable to fetch weather data for your location.');
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
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`
        );
        setWeatherData(response.data);
      } catch (err) {
        setWeatherData(null);
        setError('Location not found. Please enter a valid city.');
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-200 to-purple-400 dark:from-black dark:to-black">
      <Header setLocation={setLocation} />
      <DarkModeToggle />
      <main className="flex-grow flex flex-col items-center">
        {error && (
          <div className="bg-red-600 dark:bg-red-800 text-white text-center p-4 mb-4 rounded-lg shadow-md w-full max-w-xl">
            <div className="flex items-center justify-center mb-2">
              <FaExclamationCircle className="mr-2 text-2xl" />
              <p>{error}</p>
            </div>
          </div>
        )}
        {weatherData && (
          <div className="w-full max-w-6xl mt-8 px-4 sm:px-6 lg:px-8">
            <WeatherRecommendations weatherData={weatherData} />
            <WeatherAlerts weatherData={weatherData} />
            <WeatherCard weatherData={weatherData} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-8">
              {[1, 2, 3, 4].map(day => (
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
