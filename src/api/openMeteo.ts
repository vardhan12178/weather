import { getJson } from './http';
import type { Place } from '../types/weather';

// Open-Meteo: free, no API key. Data is CC BY 4.0 — attribution is in the footer.
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// ── Raw response shapes (only the fields we request) ─────────────────────────

export interface RawForecast {
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset_seconds: number;
  current: {
    time: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number | null;
  };
  hourly: {
    time: number[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: (number | null)[];
    weather_code: number[];
    is_day: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    uv_index: (number | null)[];
    visibility: (number | null)[];
  };
  daily: {
    time: number[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: number[];
    sunset: number[];
    uv_index_max: (number | null)[];
    precipitation_probability_max: (number | null)[];
  };
}

export interface RawAirQuality {
  current?: {
    european_aqi: number | null;
    pm10: number | null;
    pm2_5: number | null;
    carbon_monoxide: number | null;
    nitrogen_dioxide: number | null;
    ozone: number | null;
    sulphur_dioxide: number | null;
    dust: number | null;
  };
}

export interface RawSnapshot {
  current: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
}

interface RawGeocoding {
  results?: {
    name: string;
    latitude: number;
    longitude: number;
    country_code?: string;
    admin1?: string;
  }[];
}

// ── Requests ─────────────────────────────────────────────────────────────────
// Always metric: unit conversion happens at display time, so switching °C/°F
// never needs a refetch.

export const fetchForecast = (lat: number, lon: number, signal?: AbortSignal) =>
  getJson<RawForecast>(
    FORECAST_URL,
    {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
        'is_day', 'precipitation', 'weather_code', 'cloud_cover',
        'pressure_msl', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
        'precipitation_probability', 'weather_code', 'is_day',
        'wind_speed_10m', 'wind_direction_10m', 'uv_index', 'visibility',
      ].join(','),
      daily: [
        'weather_code', 'temperature_2m_max', 'temperature_2m_min',
        'sunrise', 'sunset', 'uv_index_max', 'precipitation_probability_max',
      ].join(','),
      wind_speed_unit: 'ms',
      timezone: 'auto',
      timeformat: 'unixtime',
      forecast_days: 7,
    },
    { signal },
  );

export const fetchAirQuality = (lat: number, lon: number, signal?: AbortSignal) =>
  getJson<RawAirQuality>(
    AIR_QUALITY_URL,
    {
      latitude: lat,
      longitude: lon,
      current: [
        'european_aqi', 'pm10', 'pm2_5', 'carbon_monoxide',
        'nitrogen_dioxide', 'ozone', 'sulphur_dioxide', 'dust',
      ].join(','),
      timezone: 'auto',
    },
    { signal },
  );

/** Current conditions only — a few hundred bytes, for saved-place cards. */
export const fetchSnapshot = (lat: number, lon: number, signal?: AbortSignal) =>
  getJson<RawSnapshot>(
    FORECAST_URL,
    {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,weather_code,is_day',
      timezone: 'auto',
    },
    { signal },
  );

export const searchPlaces = async (
  query: string,
  { count = 5, signal }: { count?: number; signal?: AbortSignal } = {},
): Promise<Place[]> => {
  const data = await getJson<RawGeocoding>(
    GEOCODING_URL,
    { name: query, count, language: 'en', format: 'json' },
    { signal },
  );
  return (data.results ?? []).map((r) => ({
    lat: r.latitude,
    lon: r.longitude,
    name: r.name,
    country: r.country_code?.toUpperCase(),
    admin1: r.admin1,
  }));
};
