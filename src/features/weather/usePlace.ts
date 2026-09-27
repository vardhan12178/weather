import { useCallback, useEffect, useRef, useState } from 'react';
import { searchPlaces } from '../../api/openMeteo';
import { readJson, STORAGE_KEYS } from '../../lib/storage';
import type { Place, WeatherErrorCode } from '../../types/weather';

export type PlaceStatus = 'locating' | 'searching' | 'ready' | 'error';

interface PlaceState {
  place: Place | null;
  status: PlaceStatus;
  error: WeatherErrorCode | null;
}

const GEO_OPTIONS: PositionOptions = { timeout: 10_000, maximumAge: 10 * 60_000 };

const loadLastPlace = (): Place | null => {
  const saved = readJson<Place | null>(STORAGE_KEYS.lastPlace, null);
  return saved && typeof saved.lat === 'number' && typeof saved.lon === 'number' ? saved : null;
};

const hasGeolocation = () => 'geolocation' in navigator;

/** Without geolocation there's nothing to wait for: start from the last place, or ask for a search */
const initialState = (): PlaceState => {
  if (hasGeolocation()) return { place: null, status: 'locating', error: null };
  const last = loadLastPlace();
  return last ? { place: last, status: 'ready', error: null } : { place: null, status: 'error', error: 'geo-unavailable' };
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
      setState({ place: null, status: 'error', error: 'network' });
    }
  }, []);

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
        return last
          ? { place: last, status: 'ready', error: null }
          : { place: null, status: 'error', error };
      });
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (id !== requestRef.current) return;
        setState({
          place: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          status: 'ready',
          error: null,
        });
      },
      (err) => fail(err.code === err.PERMISSION_DENIED ? 'geo-denied' : 'geo-unavailable'),
      GEO_OPTIONS,
    );
  }, []);

  /** "Use my location" button / retry */
  const locate = useCallback(() => {
    if (!hasGeolocation()) {
      setState(initialState());
      return;
    }
    const id = ++requestRef.current;
    setState((s) => ({ ...s, status: 'locating', error: null }));
    requestPosition(id);
  }, [requestPosition]);

  // Start with the device location
  useEffect(() => {
    if (!hasGeolocation()) return;
    requestPosition(++requestRef.current);
  }, [requestPosition]);

  return { ...state, selectPlace, searchCity, locate };
};
