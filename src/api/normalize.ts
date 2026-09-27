import { describeWeatherCode } from './wmo';
import type { RawAirQuality, RawForecast, RawSnapshot } from './openMeteo';
import type {
  AirQuality,
  AqiLevel,
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherReport,
  WeatherSnapshot,
} from '../types/weather';

export const HOURS_AHEAD = 48;
const MAX_VISIBILITY_M = 10_000;

/**
 * Index of the hourly slot containing `time` (the last slot that has already
 * started). `current.time` sits on a 15-minute grid, so exact matching fails.
 */
export const hourIndexAt = (hourlyTimes: number[], time: number): number => {
  let idx = 0;
  for (let i = 0; i < hourlyTimes.length; i++) {
    if (hourlyTimes[i] <= time) idx = i;
    else break;
  }
  return idx;
};

/** European AQI (0–100+) → 5 bands */
export const aqiLevel = (europeanAqi: number): AqiLevel => {
  if (europeanAqi <= 20) return 1;
  if (europeanAqi <= 40) return 2;
  if (europeanAqi <= 60) return 3;
  if (europeanAqi <= 80) return 4;
  return 5;
};

export const normalizeAirQuality = (raw: RawAirQuality | null): AirQuality | null => {
  const c = raw?.current;
  if (!c || c.european_aqi == null) return null;
  return {
    europeanAqi: c.european_aqi,
    level: aqiLevel(c.european_aqi),
    pm2_5: c.pm2_5,
    pm10: c.pm10,
    no2: c.nitrogen_dioxide,
    o3: c.ozone,
    so2: c.sulphur_dioxide,
    co: c.carbon_monoxide,
    dust: c.dust,
  };
};

const normalizeCurrent = (raw: RawForecast): CurrentWeather => {
  const { current: c, hourly: h, daily: d } = raw;
  const isDay = c.is_day === 1;
  const hIdx = hourIndexAt(h.time, c.time);

  return {
    ...describeWeatherCode(c.weather_code, isDay),
    time: c.time,
    isDay,
    temp: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    tempMax: d.temperature_2m_max[0],
    tempMin: d.temperature_2m_min[0],
    humidity: c.relative_humidity_2m,
    pressure: Math.round(c.pressure_msl),
    windSpeed: c.wind_speed_10m,
    windDeg: c.wind_direction_10m,
    windGust: c.wind_gusts_10m ?? null,
    visibility: Math.min(h.visibility[hIdx] ?? MAX_VISIBILITY_M, MAX_VISIBILITY_M),
    uvIndex: h.uv_index[hIdx] ?? d.uv_index_max[0] ?? 0,
    cloudCover: c.cloud_cover,
    precipitation: c.precipitation,
    sunrise: d.sunrise[0],
    sunset: d.sunset[0],
  };
};

const normalizeHourly = (raw: RawForecast): HourlyForecast[] => {
  const h = raw.hourly;
  const start = hourIndexAt(h.time, raw.current.time);
  const end = Math.min(start + HOURS_AHEAD, h.time.length);
  const hours: HourlyForecast[] = [];

  for (let i = start; i < end; i++) {
    const isDay = h.is_day[i] === 1;
    hours.push({
      ...describeWeatherCode(h.weather_code[i], isDay),
      time: h.time[i],
      isDay,
      temp: h.temperature_2m[i],
      feelsLike: h.apparent_temperature[i],
      humidity: h.relative_humidity_2m[i],
      pop: h.precipitation_probability[i] ?? 0,
      precipitation: h.precipitation?.[i] ?? 0,
      windSpeed: h.wind_speed_10m[i],
      windDeg: h.wind_direction_10m[i],
      windGust: h.wind_gusts_10m?.[i] ?? null,
      uvIndex: h.uv_index[i] ?? 0,
    });
  }
  return hours;
};

const normalizeDaily = (raw: RawForecast): DailyForecast[] => {
  const d = raw.daily;
  return d.time.map((time, i) => ({
    ...describeWeatherCode(d.weather_code[i], true),
    time,
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    pop: d.precipitation_probability_max[i] ?? 0,
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
    uvIndexMax: d.uv_index_max[i] ?? 0,
  }));
};

export const normalizeReport = (
  raw: RawForecast,
  rawAir: RawAirQuality | null,
  fetchedAt = Date.now(),
): WeatherReport => ({
  lat: raw.latitude,
  lon: raw.longitude,
  timezone: raw.timezone,
  utcOffset: raw.utc_offset_seconds,
  current: normalizeCurrent(raw),
  hourly: normalizeHourly(raw),
  daily: normalizeDaily(raw),
  airQuality: normalizeAirQuality(rawAir),
  fetchedAt,
});

export const normalizeSnapshot = (raw: RawSnapshot): WeatherSnapshot => {
  const isDay = raw.current.is_day === 1;
  return {
    ...describeWeatherCode(raw.current.weather_code, isDay),
    temp: raw.current.temperature_2m,
    isDay,
  };
};
