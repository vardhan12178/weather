import { getJson } from './http';
import type { Place } from '../types/weather';

// OpenStreetMap Nominatim reverse geocoding (free, no key; ODbL — credited in the footer).
const REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

interface RawReverse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    suburb?: string;
    county?: string;
    state?: string;
    country_code?: string;
  };
}

/** Name the place at these coordinates. Never throws — falls back to a generic label. */
export const reverseGeocode = async (
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<Pick<Place, 'name' | 'country' | 'admin1'>> => {
  try {
    const data = await getJson<RawReverse>(
      REVERSE_URL,
      { lat, lon, format: 'json', zoom: 10 },
      { signal, headers: { 'Accept-Language': 'en' } },
    );
    const a = data.address ?? {};
    return {
      name: a.city ?? a.town ?? a.village ?? a.hamlet ?? a.suburb ?? a.county ?? a.state ?? 'My location',
      country: a.country_code?.toUpperCase(),
      admin1: a.state,
    };
  } catch (err) {
    if (signal?.aborted) throw err;
    return { name: 'My location' };
  }
};
