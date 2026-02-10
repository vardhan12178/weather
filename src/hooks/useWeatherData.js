import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null); // New Forecast State
  const [aqi, setAqi] = useState(null);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // New State for Unit and Favorites
  const [unit, setUnit] = useState('metric'); // 'metric' (C) or 'imperial' (F)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weatherFavorites');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      // Migration: If array contains strings, convert to objects (placeholder)
      return parsed.map(item => typeof item === 'string' ? { name: item, temp: null, icon: '01d', desc: '' } : item);
    } catch (e) {
      return [];
    }
  });

  // Toggle Function
  const toggleUnit = () => setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');

  const addToFavorites = (data) => {
    // Check if city already exists (by name)
    if (!favorites.some(fav => fav.name === data.name)) {
      // Create rich favorite object
      const newFav = {
        name: data.name,
        temp: data.main.temp,
        icon: data.weather[0].icon,
        desc: data.weather[0].main,
        country: data.sys.country
      };
      // Add to beginning and limit to 5 items
      const newFavs = [newFav, ...favorites].slice(0, 5);
      setFavorites(newFavs);
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavs));
    }
  };

  const removeFromFavorites = (cityName) => {
    const newFavs = favorites.filter(fav => fav.name !== cityName);
    setFavorites(newFavs);
    localStorage.setItem('weatherFavorites', JSON.stringify(newFavs));
  };

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

  // Unified Fetch Function
  const fetchAllData = async (lat, lon) => {
    try {
      setError('');
      setLoading(true);

      // Parallel Fetching for performance
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`)
      ]);

      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
      setCoordinates({ lat, lon });

      // Fetch AQI separately (not critical path)
      fetchAQI(lat, lon);
    } catch (err) {
      setWeatherData(null);
      setForecastData(null);
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
      // First get coords for the city
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      // Then use the unified fetch
      const { lat, lon } = res.data.coord;
      fetchAllData(lat, lon);
    } catch (err) {
      setWeatherData(null);
      setError('Location not found.');
      setLoading(false);
    }
  };

  // Initial Load (Geolocation)
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true); // Show loading immediately
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchAllData(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          setError('Location access denied.');
          setLoading(false);
        }
      );
    }
  }, []); // Run once on mount

  // Refetch when Unit changes
  useEffect(() => {
    if (coordinates.lat && coordinates.lon) {
      fetchAllData(coordinates.lat, coordinates.lon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, coordinates.lat, coordinates.lon]); // Re-run when unit OR coordinates change

  // Fetch when Search Location changes
  useEffect(() => {
    if (location) fetchByCity(location);
  }, [location]);

  return {
    weatherData,
    forecastData,
    aqi,
    location,
    setLocation,
    coordinates,
    setCoordinates,
    loading,
    error,
    unit,
    toggleUnit,
    favorites,
    addToFavorites,
    removeFromFavorites
  };
};