import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ─── Open-Meteo endpoint base URLs (no API key needed) ───────────────────────
const WEATHER_URL    = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODE_URL    = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_URL    = 'https://nominatim.openstreetmap.org/reverse';

// ─── WMO weather-code → condition / description / OWM-compatible icon ────────
// Open-Meteo uses WMO codes; we map them to OWM icon strings so every existing
// component (icons, background gradients, alerts, recommendations) keeps working.
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
  return table[code] ?? { condition: 'Clear', description: 'unknown', icon: `01${s}` };
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

// ─── Normalise Open-Meteo current + daily into OWM-compatible weatherData ────
const normaliseWeather = (omData, aqData, cityInfo) => {
  const c   = omData.current;
  const h   = omData.hourly;
  const d   = omData.daily;
  const isDay = c.is_day === 1;
  const wx  = wmoMap(c.weather_code, isDay);

  // Find the hourly index matching the current timestamp
  const currentTime = c.time; // e.g. "2025-05-21T14:00"
  const hIdx = Math.max(0, h.time.findIndex(t => t === currentTime));

  // Safely read hourly values at current index (fallback gracefully)
  const visibility = Math.min(h.visibility?.[hIdx] ?? 10000, 10000);
  const uvIndex    = h.uv_index?.[hIdx] ?? d.uv_index_max?.[0] ?? 0;

  // Sunrise / sunset as Unix timestamps (daily[0] = today)
  const sunriseTs = Math.floor(new Date(d.sunrise[0]).getTime() / 1000);
  const sunsetTs  = Math.floor(new Date(d.sunset[0]).getTime()  / 1000);

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
    dt: Math.floor(new Date(c.time).getTime() / 1000),
    timezone: omData.utc_offset_seconds,

    // System / astronomy
    sys: {
      country: cityInfo.country_code ?? '',
      sunrise: sunriseTs,
      sunset:  sunsetTs,
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

// ─── Normalise Open-Meteo hourly into OWM-compatible forecastData.list ───────
// Takes one 3-hourly entry every 3 indices so the shape matches OWM's structure.
// Crucially every day will have a "12:00:00" entry which WeatherForecast relies on.
const normaliseForecast = (omData) => {
  const h   = omData.hourly;
  const list = [];
  const nowMs = Date.now();

  for (let i = 0; i < h.time.length; i++) {
    // Only keep 3-hourly entries
    if (i % 3 !== 0) continue;

    const timeStr = h.time[i];                         // "2025-05-21T12:00"
    const dtMs    = new Date(timeStr).getTime();

    // Skip timestamps already more than 1 hour in the past
    if (dtMs < nowMs - 3_600_000) continue;

    const dt     = Math.floor(dtMs / 1000);
    const hour   = parseInt(timeStr.split('T')[1], 10); // local hour (0-23)
    const isDay  = hour >= 6 && hour < 20;
    const wx     = wmoMap(h.weather_code[i], isDay);
    const dtTxt  = timeStr.replace('T', ' ') + ':00';  // "2025-05-21 12:00:00"

    list.push({
      dt,
      dt_txt: dtTxt,
      main: {
        temp:       h.temperature_2m[i],
        feels_like: h.apparent_temperature[i],
        temp_max:   h.temperature_2m[i],
        temp_min:   h.temperature_2m[i],
        humidity:   h.relative_humidity_2m[i],
        pressure:   h.pressure_msl ? Math.round(h.pressure_msl[i]) : 1013,
      },
      weather: [wx],
      wind: {
        speed: h.wind_speed_10m[i],
        deg:   h.wind_direction_10m[i],
      },
      pop:        (h.precipitation_probability[i] ?? 0) / 100,
      visibility: Math.min(h.visibility?.[i] ?? 10000, 10000),
    });

    if (list.length >= 56) break; // 7 days × 8 entries/day
  }

  return { list };
};

// ─── Reverse geocode coordinates → city name (Nominatim, free, no key) ───────
const reverseGeocode = async (lat, lon) => {
  try {
    const res = await axios.get(REVERSE_URL, {
      params: { lat, lon, format: 'json' },
      headers: { 'Accept-Language': 'en', 'User-Agent': 'WeatherlyApp/1.0' },
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

// ─────────────────────────────────────────────────────────────────────────────
//  Hook
// ─────────────────────────────────────────────────────────────────────────────
export const useWeatherData = () => {
  const [weatherData, setWeatherData]   = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqi, setAqi]                   = useState(null);
  const [location, setLocation]         = useState('');
  const [coordinates, setCoordinates]   = useState({ lat: null, lon: null });
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [unit, setUnit]                 = useState('metric');
  const [favorites, setFavorites]       = useState(() => {
    const saved = localStorage.getItem('weatherFavorites');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map(item =>
        typeof item === 'string' ? { name: item, temp: null, icon: '01d', desc: '' } : item
      );
    } catch { return []; }
  });

  // Refs — survive re-renders without causing dependency-loop issues
  const unitRef     = useRef(unit);
  unitRef.current   = unit;

  const cityInfoRef = useRef({ name: '', country_code: '', country: '', admin1: '' });

  // Tracks the last successfully-fetched combo to deduplicate calls
  const lastFetchRef = useRef({ lat: null, lon: null, unit: null });

  // ── Favorites ─────────────────────────────────────────────────────────────
  const toggleUnit = () => setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');

  const addToFavorites = (data) => {
    if (!favorites.some(f => f.name === data.name)) {
      const newFav = {
        name:    data.name,
        temp:    data.main.temp,
        icon:    data.weather[0].icon,
        desc:    data.weather[0].main,
        country: data.sys.country,
      };
      const updated = [newFav, ...favorites].slice(0, 5);
      setFavorites(updated);
      localStorage.setItem('weatherFavorites', JSON.stringify(updated));
    }
  };

  const removeFromFavorites = (cityName) => {
    const updated = favorites.filter(f => f.name !== cityName);
    setFavorites(updated);
    localStorage.setItem('weatherFavorites', JSON.stringify(updated));
  };

  // ── Core fetch ─────────────────────────────────────────────────────────────
  const fetchAllData = async (lat, lon) => {
    const currentUnit = unitRef.current;

    // Skip if we already have fresh data for this exact combo (prevents double-fetch)
    if (
      lastFetchRef.current.lat   === lat  &&
      lastFetchRef.current.lon   === lon  &&
      lastFetchRef.current.unit  === currentUnit
    ) return;

    const tempUnit = currentUnit === 'metric' ? 'celsius'     : 'fahrenheit';
    const windUnit = currentUnit === 'metric' ? 'ms'          : 'mph';

    try {
      setError('');
      setLoading(true);
      lastFetchRef.current = { lat, lon, unit: currentUnit };

      // Fire weather + air-quality requests in parallel
      const [weatherRes, aqRes] = await Promise.all([
        axios.get(WEATHER_URL, {
          params: {
            latitude:         lat,
            longitude:        lon,
            current: [
              'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
              'is_day', 'precipitation', 'weather_code', 'cloud_cover',
              'pressure_msl', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
            ].join(','),
            hourly: [
              'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
              'precipitation_probability', 'weather_code',
              'wind_speed_10m', 'wind_direction_10m',
              'uv_index', 'visibility', 'pressure_msl',
            ].join(','),
            daily: [
              'weather_code', 'temperature_2m_max', 'temperature_2m_min',
              'sunrise', 'sunset', 'uv_index_max', 'precipitation_probability_max',
            ].join(','),
            temperature_unit: tempUnit,
            wind_speed_unit:  windUnit,
            timezone:         'auto',
            forecast_days:    7,
          },
        }),
        // AQI is non-critical — never let it break the main flow
        axios.get(AIR_QUALITY_URL, {
          params: {
            latitude:  lat,
            longitude: lon,
            current: [
              'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide',
              'ozone', 'sulphur_dioxide', 'dust', 'european_aqi',
            ].join(','),
            timezone: 'auto',
          },
        }).catch(() => ({ data: null })),
      ]);

      const cityInfo = cityInfoRef.current;
      const { weatherData: wd, normalisedAqi } = normaliseWeather(weatherRes.data, aqRes.data, cityInfo);
      const fd = normaliseForecast(weatherRes.data);

      setWeatherData(wd);
      setForecastData(fd);
      setAqi(normalisedAqi);

      // Open-Meteo snaps requested coordinates to its weather grid, so the
      // returned lat/lon usually differ slightly from what we asked for. Sync
      // the dedup ref to these snapped coords BEFORE updating coordinate state —
      // otherwise the coordinates effect treats them as a brand-new location,
      // reverse-geocodes them, and overwrites the searched city name with a
      // second fetch (e.g. London → "City of Westminster").
      lastFetchRef.current = {
        lat: weatherRes.data.latitude,
        lon: weatherRes.data.longitude,
        unit: currentUnit,
      };
      setCoordinates({ lat: weatherRes.data.latitude, lon: weatherRes.data.longitude });
    } catch (err) {
      console.error('Weather fetch error:', err);
      setWeatherData(null);
      setForecastData(null);
      setError('Unable to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  // ── City-name search (Open-Meteo geocoding) ────────────────────────────────
  const fetchByCity = async (city) => {
    if (!city.trim()) return;
    try {
      setError('');
      setLoading(true);

      const res = await axios.get(GEOCODE_URL, {
        params: { name: city.trim(), count: 1, language: 'en', format: 'json' },
      });

      const results = res.data.results;
      if (!results?.length) {
        setWeatherData(null);
        setError('Location not found.');
        setLoading(false);
        return;
      }

      const r = results[0];
      cityInfoRef.current = {
        name:         r.name,
        country_code: r.country_code?.toUpperCase() ?? '',
        country:      r.country ?? '',
        admin1:       r.admin1  ?? '',
      };

      // Reset dedup ref so the new city is always fetched
      lastFetchRef.current = { lat: null, lon: null, unit: null };
      await fetchAllData(r.latitude, r.longitude);
    } catch {
      setWeatherData(null);
      setError('Location not found.');
      setLoading(false);
    }
  };

  // ── Initial load — browser geolocation ────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates({ lat: latitude, lon: longitude });
      },
      () => {
        setError('Location access denied. Search for a city above.');
        setLoading(false);
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Re-fetch when unit toggles ─────────────────────────────────────────────
  useEffect(() => {
    const { lat, lon } = coordinates;
    if (!lat || !lon) return;
    lastFetchRef.current = { ...lastFetchRef.current, unit: null };
    fetchAllData(lat, lon);
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Re-fetch when coords change externally (header "use my location") ──────
  useEffect(() => {
    const { lat, lon } = coordinates;
    if (!lat || !lon) return;

    // Avoid double fetch / double geocode if coordinates match last fetched coordinates
    if (lastFetchRef.current.lat === lat && lastFetchRef.current.lon === lon) {
      return;
    }

    const fetchCoordsData = async () => {
      cityInfoRef.current = await reverseGeocode(lat, lon);
      fetchAllData(lat, lon);
    };
    fetchCoordsData();
  }, [coordinates.lat, coordinates.lon]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch when city search changes ────────────────────────────────────────
  useEffect(() => {
    if (location) fetchByCity(location);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    weatherData, forecastData, aqi,
    location, setLocation,
    coordinates, setCoordinates,
    loading, error,
    unit, toggleUnit,
    favorites, addToFavorites, removeFromFavorites,
  };
};
