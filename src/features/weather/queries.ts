import { useQuery } from '@tanstack/react-query';
import { fetchWeatherReport, fetchWeatherSnapshot } from '../../api/weather';
import { reverseGeocode } from '../../api/nominatim';
import type { Place } from '../../types/weather';

// ~100 m precision: nearby GPS fixes share one cache entry
const coordKey = (n: number) => Math.round(n * 1000) / 1000;

const TEN_MINUTES = 10 * 60_000;

export const useWeatherReport = (place: Place | null) =>
  useQuery({
    queryKey: ['weather', place && coordKey(place.lat), place && coordKey(place.lon)],
    queryFn: ({ signal }) => fetchWeatherReport(place!.lat, place!.lon, signal),
    enabled: place != null,
    staleTime: TEN_MINUTES,
  });

/** Names a GPS position; skipped when the place already has a name. */
export const usePlaceName = (place: Place | null) =>
  useQuery({
    queryKey: ['place-name', place && coordKey(place.lat), place && coordKey(place.lon)],
    queryFn: ({ signal }) => reverseGeocode(place!.lat, place!.lon, signal),
    enabled: place != null && !place.name,
    staleTime: Infinity,
  });

/** Current conditions for a saved place card */
export const useWeatherSnapshot = (lat?: number, lon?: number) =>
  useQuery({
    queryKey: ['snapshot', lat != null && coordKey(lat), lon != null && coordKey(lon)],
    queryFn: ({ signal }) => fetchWeatherSnapshot(lat!, lon!, signal),
    enabled: lat != null && lon != null,
    staleTime: TEN_MINUTES,
  });
