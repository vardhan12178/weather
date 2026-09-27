import { useCallback, useEffect, useRef, useState } from 'react';
import { searchPlaces } from '../../api/openMeteo';
import { distanceKm } from '../../lib/geo';
import { readJson, STORAGE_KEYS } from '../../lib/storage';
import type { Place, WeatherErrorCode } from '../../types/weather';

export type PlaceStatus = 'locating' | 'searching' | 'ready' | 'error';

interface PlaceState {
  place: Place | null;
  status: PlaceStatus;
  error: WeatherErrorCode | null;
  /** True when `place` is the device's own position */
  isCurrentLocation?: boolean;
  /** A search failed but the current forecast stays on screen (shown as a toast) */
  notice?: 'offline-search' | null;
}

/** What Home saves as the last place viewed */
export interface LastPlace extends Place {
  isCurrentLocation?: boolean;
}

const GEO_OPTIONS: PositionOptions = { timeout: 10_000, maximumAge: 10 * 60_000 };

/** A new GPS fix closer than this keeps the place on screen (and its cached forecast) */
const SAME_PLACE_KM = 2;

const loadLastPlace = (): LastPlace | null => {
  const saved = readJson<LastPlace | null>(STORAGE_KEYS.lastPlace, null);
  return saved && typeof saved.lat === 'number' && typeof saved.lon === 'number' ? saved : null;
};

const hasGeolocation = () => 'geolocation' in navigator;

const offlineOr = (error: WeatherErrorCode): WeatherErrorCode => (navigator.onLine ? error : 'offline');

/**
 * Start like an installed app: reopen the last place instantly (its forecast
 * is restored from the offline cache) instead of waiting for GPS. If that was
 * "my location", GPS still refines it in the background.
 */
const initialState = (): PlaceState => {
  const last = loadLastPlace();
  if (last) {
    const { isCurrentLocation, ...place } = last;
    return { place, status: 'ready', error: null, isCurrentLocation: !!isCurrentLocation };
  }
  if (hasGeolocation()) return { place: null, status: 'locating', error: null };
  return { place: null, status: 'error', error: 'geo-unavailable' };
};

/**
 * Which place the app is showing, and how it got there (GPS, search, saved).
 * Every action bumps a request id; results from superseded actions are
 * ignored, so a slow GPS fix can't override a search the user made meanwhile.
 */
export const usePlace = () => {
  const [state, setState] = useState<PlaceState>(initialState);
  const requestRef = useRef(0);

  const selectPlace = useCallback((place: Place) => {
    requestRef.current++;
    setState({ place, status: 'ready', error: null });
  }, []);

  const searchCity = useCallback(async (query: string) => {
    const term = query.trim();
    if (!term) return;
    const id = ++requestRef.current;
    setState((s) => ({ ...s, status: 'searching', error: null }));

    try {
      const [match] = await searchPlaces(term, { count: 1 });
      if (id !== requestRef.current) return;
      setState(
        match
          ? { place: match, status: 'ready', error: null }
          : { place: null, status: 'error', error: 'not-found' },
      );
    } catch {
      if (id !== requestRef.current) return;
      setState((s) =>
        // Offline with a forecast on screen: keep it and just explain why the search didn't work
        !navigator.onLine && s.place
          ? { ...s, status: 'ready', error: null, notice: 'offline-search' }
          : { place: null, status: 'error', error: offlineOr('network') },
      );
    }
  }, []);

  const clearNotice = useCallback(() => setState((s) => ({ ...s, notice: null })), []);

  /**
   * Ask for the device position. State only changes in the async callbacks.
   * If location is unavailable, keep the place on screen, or fall back to the
   * last place the user viewed, before showing an error.
   */
  const requestPosition = useCallback((id: number) => {
    const fail = (error: WeatherErrorCode) => {
      if (id !== requestRef.current) return;
      setState((s) => {
        if (s.place) return { ...s, status: 'ready', error: null };
        const last = loadLastPlace();
        if (!last) return { place: null, status: 'error', error };
        const { isCurrentLocation, ...place } = last;
        return { place, status: 'ready', error: null, isCurrentLocation: !!isCurrentLocation };
      });
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (id !== requestRef.current) return;
        const fix = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setState((s) =>
          // Same neighbourhood as the place already shown: keep it (and its name/cache)
          s.isCurrentLocation && s.place && distanceKm(s.place, fix) < SAME_PLACE_KM
            ? { ...s, status: 'ready', error: null }
            : { place: fix, status: 'ready', error: null, isCurrentLocation: true },
        );
      },
      (err) => fail(err.code === err.PERMISSION_DENIED ? 'geo-denied' : 'geo-unavailable'),
      GEO_OPTIONS,
    );
  }, []);

  /** "Use my location" button / retry */
  const locate = useCallback(() => {
    if (!hasGeolocation()) {
      setState((s) => (s.place ? s : { place: null, status: 'error', error: 'geo-unavailable' }));
      return;
    }
    const id = ++requestRef.current;
    setState((s) => ({ ...s, status: s.place && s.isCurrentLocation ? 'ready' : 'locating', error: null }));
    requestPosition(id);
  }, [requestPosition]);

  // On start: find the device, unless the user was last looking at a chosen city
  useEffect(() => {
    if (!hasGeolocation()) return;
    const last = loadLastPlace();
    if (last && !last.isCurrentLocation) return;
    requestPosition(++requestRef.current);
  }, [requestPosition]);

  return { ...state, selectPlace, searchCity, locate, clearNotice };
};
