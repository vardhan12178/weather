import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

// ─── Open-Meteo endpoint base URLs (no API key needed) ───────────────────────
const WEATHER_URL    = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODE_URL    = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_URL    = 'https://nominatim.openstreetmap.org/reverse';

// ─── WMO weather-code → condition / description / OWM-compatible icon ────────
// Open-Meteo uses WMO codes; we map them to OWM-style objects so every existing
// component (icons, background gradients, alerts, recommendations) keeps working.
// Components read the condition as `weather[0].main` (OWM's field name).
const wmoMap = (code, isDay) => {
  const s = isDay ? 'd' : 'n';
  const table = {
    0:  { condition: 'Clear',        description: 'clear sky',                    icon: `01${s}` },
    1:  { condition: 'Clear',        description: 'mainly clear',                 icon: `01${s}` },
    2:  { condition: 'Clouds',       description: 'partly cloudy',                icon: `02${s}` },
    3:  { condition: 'Clouds',       description: 'overcast',                     icon: `04${s}` },
    45: { condition: 'Fog',          description: 'foggy',                        icon: `50${s}` },
    48: { condition: 'Fog',          description: 'depositing rime fog',          icon: `50${s}` },
    51: { condition: 'Drizzle',      description: 'light drizzle',                icon: `09${s}` },
    53: { condition: 'Drizzle',      description: 'moderate drizzle',             icon: `09${s}` },
    55: { condition: 'Drizzle',      description: 'dense drizzle',                icon: `09${s}` },
    56: { condition: 'Drizzle',      description: 'light freezing drizzle',       icon: `09${s}` },
    57: { condition: 'Drizzle',      description: 'heavy freezing drizzle',       icon: `09${s}` },
    61: { condition: 'Rain',         description: 'slight rain',                  icon: `10${s}` },
    63: { condition: 'Rain',         description: 'moderate rain',                icon: `10${s}` },
    65: { condition: 'Rain',         description: 'heavy rain',                   icon: `10${s}` },
    66: { condition: 'Rain',         description: 'light freezing rain',          icon: `13${s}` },
    67: { condition: 'Rain',         description: 'heavy freezing rain',          icon: `13${s}` },
    71: { condition: 'Snow',         description: 'slight snowfall',              icon: `13${s}` },
    73: { condition: 'Snow',         description: 'moderate snowfall',            icon: `13${s}` },
    75: { condition: 'Snow',         description: 'heavy snowfall',               icon: `13${s}` },
    77: { condition: 'Snow',         description: 'snow grains',                  icon: `13${s}` },
    80: { condition: 'Rain',         description: 'slight rain showers',          icon: `09${s}` },
    81: { condition: 'Rain',         description: 'moderate rain showers',        icon: `09${s}` },
    82: { condition: 'Rain',         description: 'violent rain showers',         icon: `09${s}` },
    85: { condition: 'Snow',         description: 'slight snow showers',          icon: `13${s}` },
    86: { condition: 'Snow',         description: 'heavy snow showers',           icon: `13${s}` },
    95: { condition: 'Thunderstorm', description: 'thunderstorm',                 icon: `11${s}` },
    96: { condition: 'Thunderstorm', description: 'thunderstorm with hail',       icon: `11${s}` },
    99: { condition: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: `11${s}` },
  };
  const entry = table[code] ?? { condition: 'Clear', description: 'unknown', icon: `01${s}` };
  return { ...entry, main: entry.condition };
};

// ─── European AQI (0–500) → OWM 1-5 index ────────────────────────────────────
const euAqiToIndex = (euAqi) => {
  if (euAqi == null) return null;
  if (euAqi <= 20) return 1;
  if (euAqi <= 40) return 2;
  if (euAqi <= 60) return 3;
  if (euAqi <= 80) return 4;
  return 5;
};

// Index of the hourly slot containing `unixSeconds` (the last slot that has
// already started). `current.time` is on a 15-minute grid, so an exact match
// against the hourly grid usually fails.
const hourIndexAt = (hourlyTimes, unixSeconds) => {
  let idx = 0;
  for (let i = 0; i < hourlyTimes.length; i++) {
    if (hourlyTimes[i] <= unixSeconds) idx = i;
    else break;
  }
  return idx;
};

// ─── Normalise Open-Meteo current + daily into OWM-compatible weatherData ────
// Requests use `timeformat=unixtime`, so every time value is a real UTC instant.
const normaliseWeather = (omData, aqData, cityInfo) => {
  const c   = omData.current;
  const h   = omData.hourly;
  const d   = omData.daily;
  const isDay = c.is_day === 1;
  const wx  = wmoMap(c.weather_code, isDay);

  const hIdx = hourIndexAt(h.time, c.time);

  const visibility = Math.min(h.visibility?.[hIdx] ?? 10000, 10000);
  const uvIndex    = h.uv_index?.[hIdx] ?? d.uv_index_max?.[0] ?? 0;

  // AQI in OWM-compatible shape
  const aqCurrent  = aqData?.current;
  const aqiIndex   = euAqiToIndex(aqCurrent?.european_aqi);
  const normalisedAqi = aqiIndex ? {
    main: { aqi: aqiIndex },
    components: {
      pm2_5: aqCurrent?.pm2_5   ?? null,
      pm10:  aqCurrent?.pm10    ?? null,
      no2:   aqCurrent?.nitrogen_dioxide ?? null,
      o3:    aqCurrent?.ozone   ?? null,
      so2:   aqCurrent?.sulphur_dioxide  ?? null,
      co:    aqCurrent?.carbon_monoxide  ?? null,
      dust:  aqCurrent?.dust    ?? null,
    },
  } : null;

  const weatherData = {
    // Identity
    name: cityInfo.name,
    coord: { lat: omData.latitude, lon: omData.longitude },

    // Time
    dt: c.time,
    timezone: omData.utc_offset_seconds,
    timezoneName: omData.timezone,

    // System / astronomy (daily[0] = today)
    sys: {
      country: cityInfo.country_code ?? '',
      sunrise: d.sunrise[0],
      sunset:  d.sunset[0],
    },

    // Condition
    weather: [wx],

    // Temperature & pressure
    main: {
      temp:       c.temperature_2m,
      feels_like: c.apparent_temperature,
      temp_max:   d.temperature_2m_max[0],
      temp_min:   d.temperature_2m_min[0],
      humidity:   c.relative_humidity_2m,
      pressure:   Math.round(c.pressure_msl),
    },

    // Wind
    wind: {
      speed: c.wind_speed_10m,
      deg:   c.wind_direction_10m,
      gust:  c.wind_gusts_10m,
    },

    // Extras (not in OWM free tier, but components check for them gracefully)
    visibility,
    uvIndex,
    clouds: { all: c.cloud_cover },
    isDay,

    // Precipitation
    rain: c.precipitation > 0 ? { '1h': c.precipitation } : undefined,
  };

  return { weatherData, normalisedAqi };
};

// ─── Normalise Open-Meteo hourly + daily into forecastData ───────────────────
// `list`  — true 1-hour steps starting at the current hour (next 48 h)
// `daily` — one entry per day straight from the daily API (not rebuilt from samples)
const HOURS_AHEAD = 48;

const normaliseForecast = (omData) => {
  const h = omData.hourly;
  const d = omData.daily;
  const start = hourIndexAt(h.time, omData.current.time);

  const list = [];
  for (let i = start; i < h.time.length && list.length < HOURS_AHEAD; i++) {
    list.push({
      dt: h.time[i],
      main: {
        temp:       h.temperature_2m[i],
        feels_like: h.apparent_temperature[i],
        humidity:   h.relative_humidity_2m[i],
        pressure:   h.pressure_msl ? Math.round(h.pressure_msl[i]) : 1013,
      },
      weather: [wmoMap(h.weather_code[i], h.is_day?.[i] === 1)],
      wind: {
        speed: h.wind_speed_10m[i],
        deg:   h.wind_direction_10m[i],
      },
      pop:        (h.precipitation_probability[i] ?? 0) / 100,
      visibility: Math.min(h.visibility?.[i] ?? 10000, 10000),
    });
  }

  const daily = d.time.map((dayStart, i) => ({
    dt: dayStart,
    weather: [wmoMap(d.weather_code[i], true)],
    temp_max: d.temperature_2m_max[i],
    temp_min: d.temperature_2m_min[i],
    pop: (d.precipitation_probability_max?.[i] ?? 0) / 100,
  }));

  return { list, daily, timezoneName: omData.timezone };
};

// ─── Reverse geocode coordinates → city name (Nominatim, free, no key) ───────
const reverseGeocode = async (lat, lon) => {
  try {
    const res = await axios.get(REVERSE_URL, {
      params: { lat, lon, format: 'json' },
      headers: { 'Accept-Language': 'en' },
    });
    const a = res.data.address ?? {};
    const name = a.city ?? a.town ?? a.village ?? a.hamlet ?? a.county ?? a.state ?? 'Your Location';
    return {
      name,
      country_code: (a.country_code ?? '').toUpperCase(),
      country:      a.country ?? '',
      admin1:       a.state   ?? '',
    };
  } catch {
    return { name: 'Your Location', country_code: '', country: '' };
  }
};

const weatherParams = (lat, lon, unit) => ({
  latitude:  lat,
  longitude: lon,
  current: [
    'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
    'is_day', 'precipitation', 'weather_code', 'cloud_cover',
    'pressure_msl', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
  ].join(','),
  hourly: [
    'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
    'precipitation_probability', 'weather_code', 'is_day',
    'wind_speed_10m', 'wind_direction_10m',
    'uv_index', 'visibility', 'pressure_msl',
  ].join(','),
  daily: [
    'weather_code', 'temperature_2m_max', 'temperature_2m_min',
    'sunrise', 'sunset', 'uv_index_max', 'precipitation_probability_max',
  ].join(','),
  temperature_unit: unit === 'metric' ? 'celsius' : 'fahrenheit',
  wind_speed_unit:  unit === 'metric' ? 'ms' : 'mph',
  timezone:         'auto',
  timeformat:       'unixtime',
  forecast_days:    7,
});

const airQualityParams = (lat, lon) => ({
  latitude:  lat,
  longitude: lon,
  current: [
    'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide',
    'ozone', 'sulphur_dioxide', 'dust', 'european_aqi',
  ].join(','),
  timezone: 'auto',
});

// ─── Favourites persistence ──────────────────────────────────────────────────
const FAVORITES_KEY = 'weatherFavorites';
export const MAX_FAVORITES = 5;

const loadFavorites = () => {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.map(item =>
      typeof item === 'string' ? { name: item, temp: null, icon: '01d', desc: '' } : item
    );
  } catch { return []; }
};

const saveFavorites = (list) => {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(list)); } catch { /* storage full/blocked */ }
};

// Error codes surfaced to the UI (see NotFound.js for the copy)
export const ERRORS = {
  NOT_FOUND:       'not-found',
  NETWORK:         'network',
  GEO_DENIED:      'geo-denied',
  GEO_UNAVAILABLE: 'geo-unavailable',
};

// ─────────────────────────────────────────────────────────────────────────────
//  Hook
// ─────────────────────────────────────────────────────────────────────────────
export const useWeatherData = () => {
  const [weatherData, setWeatherData]   = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqi, setAqi]                   = useState(null);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [refreshing, setRefreshing]     = useState(false);
  const [unit, setUnit]                 = useState('metric');
  const [favorites, setFavorites]       = useState(loadFavorites);

  const unitRef = useRef(unit);
  unitRef.current = unit;

  // The place currently on screen — reused by refresh and unit changes
  const placeRef = useRef(null);

  // Every request bumps this; responses from superseded requests are dropped,
  // so a slow earlier search can never overwrite a newer one.
  const requestIdRef = useRef(0);

  const clearData = () => {
    setWeatherData(null);
    setForecastData(null);
    setAqi(null);
  };

  // ── Core fetch ─────────────────────────────────────────────────────────────
  // `silent` keeps the current screen visible (refresh / unit toggle) instead
  // of swapping in the loading skeleton.
  const loadPlace = useCallback(async (lat, lon, cityInfo, { silent = false } = {}) => {
    const requestId = ++requestIdRef.current;
    const isLatest = () => requestId === requestIdRef.current;
    const currentUnit = unitRef.current;

    setError('');
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const [info, weatherRes, aqRes] = await Promise.all([
        cityInfo ?? reverseGeocode(lat, lon),
        axios.get(WEATHER_URL, { params: weatherParams(lat, lon, currentUnit) }),
        // AQI is non-critical — never let it break the main flow
        axios.get(AIR_QUALITY_URL, { params: airQualityParams(lat, lon) }).catch(() => ({ data: null })),
      ]);
      if (!isLatest()) return;

      const { weatherData: wd, normalisedAqi } = normaliseWeather(weatherRes.data, aqRes.data, info);
      setWeatherData(wd);
      setForecastData(normaliseForecast(weatherRes.data));
      setAqi(normalisedAqi);
      placeRef.current = { lat, lon, cityInfo: info };
    } catch (err) {
      if (!isLatest()) return;
      console.error('Weather fetch error:', err);
      // A failed background refresh keeps the last good data on screen
      if (!silent) {
        clearData();
        setError(ERRORS.NETWORK);
      }
    } finally {
      if (isLatest()) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  // ── City-name search (Open-Meteo geocoding) ────────────────────────────────
  // Called directly (not via an effect), so searching the same city twice works.
  const searchCity = useCallback(async (city) => {
    const term = city?.trim();
    if (!term) return;

    const requestId = ++requestIdRef.current;
    setError('');
    setLoading(true);

    try {
      const res = await axios.get(GEOCODE_URL, {
        params: { name: term, count: 1, language: 'en', format: 'json' },
      });
      if (requestId !== requestIdRef.current) return;

      const r = res.data.results?.[0];
      if (!r) {
        clearData();
        setError(ERRORS.NOT_FOUND);
        setLoading(false);
        return;
      }

      await loadPlace(r.latitude, r.longitude, {
        name:         r.name,
        country_code: r.country_code?.toUpperCase() ?? '',
        country:      r.country ?? '',
        admin1:       r.admin1  ?? '',
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error('Geocoding error:', err);
      clearData();
      setError(ERRORS.NETWORK);
      setLoading(false);
    }
  }, [loadPlace]);

  const loadCoordinates = useCallback(({ lat, lon }) => {
    if (lat == null || lon == null) return;
    loadPlace(lat, lon);
  }, [loadPlace]);

  const refresh = useCallback(() => {
    const place = placeRef.current;
    if (!place) return Promise.resolve();
    return loadPlace(place.lat, place.lon, place.cityInfo, { silent: true });
  }, [loadPlace]);

  // ── Initial load — browser geolocation ────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setError(ERRORS.GEO_UNAVAILABLE);
      return;
    }
    // If the user searches before the position arrives, their search wins
    const startedAt = requestIdRef.current;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (requestIdRef.current !== startedAt) return;
        loadPlace(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (requestIdRef.current !== startedAt) return;
        setError(err.code === err.PERMISSION_DENIED ? ERRORS.GEO_DENIED : ERRORS.GEO_UNAVAILABLE);
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, [loadPlace]);

  // ── Re-fetch the current place when the unit changes ─────────────────────
  useEffect(() => {
    const place = placeRef.current;
    if (!place) return;
    loadPlace(place.lat, place.lon, place.cityInfo, { silent: true });
  }, [unit, loadPlace]);

  // ── Favorites ─────────────────────────────────────────────────────────────
  const toggleUnit = () => setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');

  const addToFavorites = (data) => {
    if (favorites.some(f => f.name === data.name)) return;
    const newFav = {
      name:    data.name,
      temp:    data.main.temp,
      unit,    // so the saved temperature can be converted if the unit changes later
      icon:    data.weather[0].icon,
      desc:    data.weather[0].main,
      country: data.sys.country,
    };
    const updated = [newFav, ...favorites].slice(0, MAX_FAVORITES);
    setFavorites(updated);
    saveFavorites(updated);
  };

  const removeFromFavorites = (cityName) => {
    const updated = favorites.filter(f => f.name !== cityName);
    setFavorites(updated);
    saveFavorites(updated);
  };

  return {
    weatherData, forecastData, aqi,
    setLocation: searchCity,
    setCoordinates: loadCoordinates,
    refresh, refreshing,
    loading, error,
    unit, toggleUnit,
    favorites, addToFavorites, removeFromFavorites,
  };
};
