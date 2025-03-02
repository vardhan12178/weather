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
        setCoordinates({ lat: response.data.coord.lat, lon: response.data.coord.lon }); // Update coordinates
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 font-sans">
      <Header setLocation={setLocation} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && location && (
          <div className="w-full max-w-xl mx-auto mt-4">
            <NotFound />
          </div>
        )}
        {weatherData && (
          <div className="space-y-8">
            {/* Weather Card and Hourly Temperature */}
            <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
              <div className="w-full lg:w-1/2 max-w-2xl h-full">
                <WeatherCard weatherData={weatherData} />
              </div>
              <div className="w-full lg:w-1/2">
                <HourlyTemperature lat={coordinates.lat} lon={coordinates.lon} />
              </div>
            </div>

            {/* Weather Alerts and Recommendations */}
            <WeatherAlerts weatherData={weatherData} />
            <WeatherRecommendations weatherData={weatherData} />

            {/* Weather Forecast */}
            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
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