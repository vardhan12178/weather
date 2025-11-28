import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '30755a4a95cbde88af53afaafad1ea50'; 

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [aqi, setAqi] = useState(null); // New AQI State
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAQI = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      setAqi(res.data.list[0]);
    } catch (e) {
      console.error("AQI fetch failed", e);
    }
  };

  const fetchByCoords = async (lat, lon) => {
    try {
      setError('');
      setLoading(true);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(res.data);
      setCoordinates({ lat, lon });
      fetchAQI(lat, lon); // Fetch AQI after weather
    } catch (err) {
      setWeatherData(null);
      setError('Unable to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (city) => {
    if (!city.trim()) return;
    try {
      setError('');
      setLoading(true);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(res.data);
      setCoordinates({ lat: res.data.coord.lat, lon: res.data.coord.lon });
      fetchAQI(res.data.coord.lat, res.data.coord.lon);
    } catch (err) {
      setWeatherData(null);
      setError('Location not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        (err) => setError('Location access denied.')
      );
    }
  }, []);

  useEffect(() => {
    if (location) fetchByCity(location);
  }, [location]);

  return { weatherData, aqi, location, setLocation, coordinates, setCoordinates, loading, error };
};