import { formatHour } from '../../lib/time';
import type { AqiLevel, CurrentWeather, HourlyForecast, WeatherReport } from '../../types/weather';

// Pure helpers behind the metric tiles and their detail sheets.

export type MetricId = 'feelsLike' | 'uv' | 'wind' | 'precipitation' | 'airQuality' | 'humidity' | 'visibility' | 'pressure' | 'sun';

export const UV_LEVELS = [
  { max: 2, label: 'Low', advice: 'No protection needed.' },
  { max: 5, label: 'Moderate', advice: 'Wear sunscreen if you are outside for long.' },
  { max: 7, label: 'High', advice: 'Wear sunscreen and a hat; seek shade at midday.' },
  { max: 10, label: 'Very high', advice: 'Avoid the midday sun; sunscreen, hat and sunglasses.' },
  { max: Infinity, label: 'Extreme', advice: 'Stay in the shade around midday; full protection.' },
] as const;

export const uvLevel = (uv: number) => UV_LEVELS.find((l) => Math.round(uv) <= l.max)!;

/** "Use sun protection until 4 pm" — based on the hourly UV forecast (UV ≥ 3) */
export const uvProtectionNote = (report: WeatherReport): string => {
  const today = report.hourly.slice(0, 18);
  const lastHigh = [...today].reverse().find((h) => h.uvIndex >= 3);
  if (!lastHigh) return 'Low for the rest of the day.';
  if (lastHigh === today[0] && report.current.uvIndex < 3) return 'Low for the rest of the day.';
  return `Use sun protection until ${formatHour(lastHigh.time + 3600, report.timezone)}.`;
};

export const feelsLikeNote = (c: CurrentWeather): string => {
  const diff = c.feelsLike - c.temp;
  if (Math.abs(diff) < 1.5) return 'Similar to the actual temperature.';
  if (diff > 0) return c.humidity >= 60 ? 'Humidity is making it feel warmer.' : 'Feels warmer than it is.';
  return c.windSpeed >= 3 ? 'Wind is making it feel cooler.' : 'Feels cooler than it is.';
};

export const humidityNote = (humidity: number): string => {
  if (humidity >= 75) return 'Muggy — the air feels heavy.';
  if (humidity <= 30) return 'Dry air.';
  return 'Comfortable.';
};

export const visibilityNote = (meters: number): string => {
  if (meters >= 9500) return 'Perfectly clear view.';
  if (meters >= 5000) return 'Good visibility, slight haze.';
  if (meters >= 1000) return 'Hazy — take care on the road.';
  return 'Very poor visibility.';
};

export const pressureNote = (hPa: number): string => {
  if (hPa >= 1020) return 'High pressure — usually settled weather.';
  if (hPa <= 1005) return 'Low pressure — clouds and rain are more likely.';
  return 'Normal pressure.';
};

export const AQI_LEVELS: Record<AqiLevel, { label: string; color: string; advice: string }> = {
  1: { label: 'Good', color: '#4ade80', advice: 'Air quality is ideal for outdoor activities.' },
  2: { label: 'Fair', color: '#a3e635', advice: 'Air quality is acceptable for most people.' },
  3: { label: 'Moderate', color: '#facc15', advice: 'Sensitive people should limit long outdoor exertion.' },
  4: { label: 'Poor', color: '#fb923c', advice: 'Consider reducing time outdoors, especially if you have breathing problems.' },
  5: { label: 'Very poor', color: '#f87171', advice: 'Avoid outdoor exertion; keep windows closed.' },
};

/** Total precipitation (mm) and max chance over the next `hours` */
export const precipitationOutlook = (hourly: HourlyForecast[], hours = 24) => {
  const window = hourly.slice(0, hours);
  const total = window.reduce((sum, h) => sum + (h.precipitation || 0), 0);
  const maxPop = window.reduce((m, h) => Math.max(m, h.pop), 0);
  return { total, maxPop };
};

export const formatPrecip = (mm: number) => (mm > 0 && mm < 1 ? `${mm.toFixed(1)} mm` : `${Math.round(mm)} mm`);

/** Where the sun is between today's sunrise and sunset (0–1), or null at night */
export const sunProgress = (now: number, sunrise: number, sunset: number): number | null =>
  now < sunrise || now > sunset ? null : (now - sunrise) / (sunset - sunrise);

export const daylightLength = (sunrise: number, sunset: number) => {
  const minutes = Math.max(0, Math.round((sunset - sunrise) / 60));
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
};
