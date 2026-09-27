import { fetchAirQuality, fetchForecast, fetchSnapshot } from './openMeteo';
import { normalizeReport, normalizeSnapshot } from './normalize';
import type { WeatherReport, WeatherSnapshot } from '../types/weather';

export const fetchWeatherReport = async (
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherReport> => {
  const [forecast, air] = await Promise.all([
    fetchForecast(lat, lon, signal),
    // Air quality is a nice-to-have: never let it fail the whole report
    fetchAirQuality(lat, lon, signal).catch(() => null),
  ]);
  return normalizeReport(forecast, air);
};

export const fetchWeatherSnapshot = async (
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherSnapshot> => normalizeSnapshot(await fetchSnapshot(lat, lon, signal));
