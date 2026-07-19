import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';
const LAST_LOCATION_KEY = 'weatherLastLocation';
const UNIT_KEY = 'weatherUnit';
const DEFAULT_LOCATION = 'Mumbai';

export const wmoMap = (code, isDay) => {
  const suffix = isDay ? 'd' : 'n';
  const table = {
    0: { condition: 'Clear', description: 'clear sky', icon: `01${suffix}` },
    1: { condition: 'Clear', description: 'mainly clear', icon: `01${suffix}` },
    2: { condition: 'Clouds', description: 'partly cloudy', icon: `02${suffix}` },
    3: { condition: 'Clouds', description: 'overcast', icon: `04${suffix}` },
    45: { condition: 'Fog', description: 'foggy', icon: `50${suffix}` },
    48: { condition: 'Fog', description: 'rime fog', icon: `50${suffix}` },
    51: { condition: 'Drizzle', description: 'light drizzle', icon: `09${suffix}` },
    53: { condition: 'Drizzle', description: 'moderate drizzle', icon: `09${suffix}` },
    55: { condition: 'Drizzle', description: 'dense drizzle', icon: `09${suffix}` },
    56: { condition: 'Drizzle', description: 'freezing drizzle', icon: `09${suffix}` },
    57: { condition: 'Drizzle', description: 'heavy freezing drizzle', icon: `09${suffix}` },
    61: { condition: 'Rain', description: 'slight rain', icon: `10${suffix}` },
    63: { condition: 'Rain', description: 'moderate rain', icon: `10${suffix}` },
    65: { condition: 'Rain', description: 'heavy rain', icon: `10${suffix}` },
    66: { condition: 'Rain', description: 'freezing rain', icon: `13${suffix}` },
    67: { condition: 'Rain', description: 'heavy freezing rain', icon: `13${suffix}` },
    71: { condition: 'Snow', description: 'slight snowfall', icon: `13${suffix}` },
    73: { condition: 'Snow', description: 'moderate snowfall', icon: `13${suffix}` },
    75: { condition: 'Snow', description: 'heavy snowfall', icon: `13${suffix}` },
    77: { condition: 'Snow', description: 'snow grains', icon: `13${suffix}` },
    80: { condition: 'Rain', description: 'slight rain showers', icon: `09${suffix}` },
    81: { condition: 'Rain', description: 'moderate rain showers', icon: `09${suffix}` },
    82: { condition: 'Rain', description: 'violent rain showers', icon: `09${suffix}` },
    85: { condition: 'Snow', description: 'slight snow showers', icon: `13${suffix}` },
    86: { condition: 'Snow', description: 'heavy snow showers', icon: `13${suffix}` },
    95: { condition: 'Thunderstorm', description: 'thunderstorm', icon: `11${suffix}` },
    96: { condition: 'Thunderstorm', description: 'thunderstorm with hail', icon: `11${suffix}` },
    99: { condition: 'Thunderstorm', description: 'severe thunderstorm with hail', icon: `11${suffix}` },
  };
  return table[code] ?? { condition: 'Clear', description: 'conditions unavailable', icon: `01${suffix}` };
};

export const euAqiToIndex = (value) => {
  if (value == null) return null;
  if (value <= 20) return 1;
  if (value <= 40) return 2;
  if (value <= 60) return 3;
  if (value <= 80) return 4;
  return 5;
};

const getLocalParts = (timestamp, offsetSeconds) => {
  const date = new Date((timestamp + offsetSeconds) * 1000);
  const iso = date.toISOString();
  return {
    dateKey: iso.slice(0, 10),
    timeLabel: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      timeZone: 'UTC',
    }),
    dateLabel: date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }),
  };
};

export const normaliseWeather = (omData, aqData, cityInfo) => {
  const current = omData.current;
  const hourly = omData.hourly;
  const daily = omData.daily;
  const isDay = current.is_day === 1;
  const weather = wmoMap(current.weather_code, isDay);
  const hourlyIndex = Math.max(0, hourly.time.findIndex((time) => time === current.time));
  const rawEuropeanAqi = aqData?.current?.european_aqi;
  const aqiIndex = euAqiToIndex(rawEuropeanAqi);

  const normalisedAqi = aqiIndex
    ? {
        main: { aqi: aqiIndex, value: Math.round(rawEuropeanAqi), scale: 'European AQI' },
        components: {
          pm2_5: aqData.current?.pm2_5 ?? null,
          pm10: aqData.current?.pm10 ?? null,
          no2: aqData.current?.nitrogen_dioxide ?? null,
          o3: aqData.current?.ozone ?? null,
          so2: aqData.current?.sulphur_dioxide ?? null,
          co: aqData.current?.carbon_monoxide ?? null,
          dust: aqData.current?.dust ?? null,
        },
      }
    : null;

  return {
    weatherData: {
      name: cityInfo.name || 'Current location',
      coord: { lat: omData.latitude, lon: omData.longitude },
      dt: current.time,
      timezone: omData.utc_offset_seconds,
      timezoneAbbreviation: omData.timezone_abbreviation,
      updatedAt: Date.now(),
      sys: {
        country: cityInfo.country_code || '',
        sunrise: daily.sunrise[0],
        sunset: daily.sunset[0],
      },
      weather: [weather],
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        temp_max: daily.temperature_2m_max[0],
        temp_min: daily.temperature_2m_min[0],
        humidity: current.relative_humidity_2m,
        pressure: Math.round(current.pressure_msl),
      },
      wind: {
        speed: current.wind_speed_10m,
        deg: current.wind_direction_10m,
        gust: current.wind_gusts_10m,
      },
      visibility: Math.min(hourly.visibility?.[hourlyIndex] ?? 10000, 10000),
      uvIndex: hourly.uv_index?.[hourlyIndex] ?? daily.uv_index_max?.[0] ?? 0,
      clouds: { all: current.cloud_cover },
      isDay,
      rain: current.precipitation > 0 ? { '1h': current.precipitation } : undefined,
    },
    normalisedAqi,
  };
};

export const normaliseForecast = (omData) => {
  const offset = omData.utc_offset_seconds;
  const list = [];

  for (let index = 0; index < omData.hourly.time.length; index += 3) {
    const timestamp = omData.hourly.time[index];
    if (timestamp < Math.floor(Date.now() / 1000) - 3600) continue;
    const local = getLocalParts(timestamp, offset);
    const localHour = new Date((timestamp + offset) * 1000).getUTCHours();

    list.push({
      dt: timestamp,
      localDateKey: local.dateKey,
      localTimeLabel: local.timeLabel,
      dt_txt: `${local.dateKey} ${String(localHour).padStart(2, '0')}:00:00`,
      main: {
        temp: omData.hourly.temperature_2m[index],
        feels_like: omData.hourly.apparent_temperature[index],
        humidity: omData.hourly.relative_humidity_2m[index],
        pressure: Math.round(omData.hourly.pressure_msl?.[index] ?? 1013),
      },
      weather: [wmoMap(omData.hourly.weather_code[index], localHour >= 6 && localHour < 20)],
      wind: {
        speed: omData.hourly.wind_speed_10m[index],
        deg: omData.hourly.wind_direction_10m[index],
      },
      pop: (omData.hourly.precipitation_probability[index] ?? 0) / 100,
      visibility: Math.min(omData.hourly.visibility?.[index] ?? 10000, 10000),
    });
    if (list.length >= 56) break;
  }

  const daily = omData.daily.time.map((timestamp, index) => {
    const local = getLocalParts(timestamp, offset);
    return {
      dt: timestamp,
      localDateKey: local.dateKey,
      dateLabel: local.dateLabel,
      main: {
        temp_min: omData.daily.temperature_2m_min[index],
        temp_max: omData.daily.temperature_2m_max[index],
      },
      weather: [wmoMap(omData.daily.weather_code[index], true)],
      pop: omData.daily.precipitation_probability_max?.[index] ?? 0,
    };
  });

  return { list, daily, timezone: offset };
};

const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(REVERSE_URL, {
      params: { lat, lon, format: 'json' },
      headers: { 'Accept-Language': 'en' },
    });
    const address = response.data.address ?? {};
    return {
      name: address.city ?? address.town ?? address.village ?? address.county ?? address.state ?? 'Current location',
      country_code: (address.country_code ?? '').toUpperCase(),
      country: address.country ?? '',
      admin1: address.state ?? '',
    };
  } catch {
    return { name: 'Current location', country_code: '', country: '', admin1: '' };
  }
};

const getSavedJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '') || fallback;
  } catch {
    return fallback;
  }
};

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState(() => localStorage.getItem(UNIT_KEY) || 'metric');
  const [favorites, setFavorites] = useState(() => {
    const saved = getSavedJson('weatherFavorites', []);
    return Array.isArray(saved)
      ? saved.map((item) => (typeof item === 'string' ? { name: item, temp: null, icon: '01d', desc: '' } : item))
      : [];
  });

  const unitRef = useRef(unit);
  const coordinatesRef = useRef(coordinates);
  const cityInfoRef = useRef({ name: '', country_code: '', country: '', admin1: '' });
  const lastFetchRef = useRef({ lat: null, lon: null, unit: null });
  const requestIdRef = useRef(0);
  unitRef.current = unit;
  coordinatesRef.current = coordinates;

  const toggleUnit = () => {
    setUnit((current) => {
      const next = current === 'metric' ? 'imperial' : 'metric';
      localStorage.setItem(UNIT_KEY, next);
      setFavorites((savedPlaces) => {
        const updated = savedPlaces.map((place) => ({ ...place, temp: null }));
        localStorage.setItem('weatherFavorites', JSON.stringify(updated));
        return updated;
      });
      return next;
    });
  };

  const addToFavorites = (data) => {
    setFavorites((current) => {
      if (current.some((favorite) => favorite.name === data.name && favorite.country === data.sys.country)) return current;
      const updated = [
        {
          name: data.name,
          temp: data.main.temp,
          icon: data.weather[0].icon,
          desc: data.weather[0].condition,
          country: data.sys.country,
        },
        ...current,
      ].slice(0, 6);
      localStorage.setItem('weatherFavorites', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromFavorites = (cityName) => {
    setFavorites((current) => {
      const updated = current.filter((favorite) => favorite.name !== cityName);
      localStorage.setItem('weatherFavorites', JSON.stringify(updated));
      return updated;
    });
  };

  const fetchAllData = useCallback(async (lat, lon, { force = false } = {}) => {
    const currentUnit = unitRef.current;
    if (!force && lastFetchRef.current.lat === lat && lastFetchRef.current.lon === lon && lastFetchRef.current.unit === currentUnit) return;

    const requestId = ++requestIdRef.current;
    try {
      setError('');
      setLoading(true);
      const [weatherResponse, airResponse] = await Promise.all([
        axios.get(WEATHER_URL, {
          params: {
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
            hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,uv_index,visibility,pressure_msl',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
            temperature_unit: currentUnit === 'metric' ? 'celsius' : 'fahrenheit',
            wind_speed_unit: currentUnit === 'metric' ? 'ms' : 'mph',
            timezone: 'auto',
            timeformat: 'unixtime',
            forecast_days: 7,
          },
        }),
        axios
          .get(AIR_QUALITY_URL, {
            params: {
              latitude: lat,
              longitude: lon,
              current: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide,dust,european_aqi',
              timezone: 'auto',
            },
          })
          .catch(() => ({ data: null })),
      ]);

      if (requestId !== requestIdRef.current) return;
      const cityInfo = cityInfoRef.current;
      const { weatherData: nextWeather, normalisedAqi } = normaliseWeather(weatherResponse.data, airResponse.data, cityInfo);
      setWeatherData(nextWeather);
      setForecastData(normaliseForecast(weatherResponse.data));
      setAqi(normalisedAqi);
      setCoordinates({ lat: weatherResponse.data.latitude, lon: weatherResponse.data.longitude });
      lastFetchRef.current = { lat: weatherResponse.data.latitude, lon: weatherResponse.data.longitude, unit: currentUnit };
      localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({ ...cityInfo, lat, lon }));
    } catch (fetchError) {
      if (requestId !== requestIdRef.current) return;
      lastFetchRef.current = { lat: null, lon: null, unit: null };
      setError('Weather data is unavailable right now. Please try again.');
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  const fetchByCity = useCallback(async (city) => {
    const term = city.trim();
    if (!term) return;
    const requestId = ++requestIdRef.current;
    try {
      setError('');
      setLoading(true);
      const response = await axios.get(GEOCODE_URL, {
        params: { name: term, count: 1, language: 'en', format: 'json' },
      });
      if (requestId !== requestIdRef.current) return;
      const result = response.data.results?.[0];
      if (!result) throw new Error('Location not found');
      cityInfoRef.current = {
        name: result.name,
        country_code: result.country_code?.toUpperCase() ?? '',
        country: result.country ?? '',
        admin1: result.admin1 ?? '',
      };
      lastFetchRef.current = { lat: null, lon: null, unit: null };
      await fetchAllData(result.latitude, result.longitude, { force: true });
    } catch {
      if (requestId === requestIdRef.current) {
        setError(`We couldn't find “${term}”. Try a city and country name.`);
        setLoading(false);
      }
    }
  }, [fetchAllData]);

  const refreshWeather = useCallback(() => {
    if (coordinates.lat == null || coordinates.lon == null) return;
    fetchAllData(coordinates.lat, coordinates.lon, { force: true });
  }, [coordinates.lat, coordinates.lon, fetchAllData]);

  const searchLocation = useCallback((city) => {
    const term = city.trim();
    if (!term) return;
    setLocation((current) => {
      if (current === term) fetchByCity(term);
      return term;
    });
  }, [fetchByCity]);

  useEffect(() => {
    const saved = getSavedJson(LAST_LOCATION_KEY, null);
    if (saved?.lat != null && saved?.lon != null) {
      cityInfoRef.current = saved;
      setCoordinates({ lat: saved.lat, lon: saved.lon });
    } else {
      setLocation(DEFAULT_LOCATION);
    }
  }, []);

  useEffect(() => {
    if (location) fetchByCity(location);
  }, [location, fetchByCity]);

  useEffect(() => {
    if (!weatherData) return;
    setFavorites((current) => {
      let changed = false;
      const updated = current.map((favorite) => {
        if (favorite.name !== weatherData.name || favorite.country !== weatherData.sys.country) return favorite;
        changed = true;
        return {
          ...favorite,
          temp: weatherData.main.temp,
          icon: weatherData.weather[0].icon,
          desc: weatherData.weather[0].condition,
        };
      });
      if (changed) localStorage.setItem('weatherFavorites', JSON.stringify(updated));
      return changed ? updated : current;
    });
  }, [weatherData]);

  useEffect(() => {
    if (coordinates.lat == null || coordinates.lon == null) return;
    if (lastFetchRef.current.lat === coordinates.lat && lastFetchRef.current.lon === coordinates.lon) return;
    const fetchCoordinates = async () => {
      cityInfoRef.current = await reverseGeocode(coordinates.lat, coordinates.lon);
      await fetchAllData(coordinates.lat, coordinates.lon);
    };
    fetchCoordinates();
  }, [coordinates.lat, coordinates.lon, fetchAllData]);

  useEffect(() => {
    const { lat, lon } = coordinatesRef.current;
    if (lat == null || lon == null) return;
    lastFetchRef.current = { ...lastFetchRef.current, unit: null };
    fetchAllData(lat, lon, { force: true });
  }, [unit, fetchAllData]);

  return {
    weatherData,
    forecastData,
    aqi,
    location,
    setLocation: searchLocation,
    coordinates,
    setCoordinates,
    loading,
    error,
    unit,
    toggleUnit,
    favorites,
    addToFavorites,
    removeFromFavorites,
    refreshWeather,
  };
};
