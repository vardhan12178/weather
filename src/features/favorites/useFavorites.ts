import { useCallback, useState } from 'react';
import { readJson, STORAGE_KEYS, writeJson } from '../../lib/storage';
import type { Place } from '../../types/weather';

export const MAX_FAVORITES = 5;

/** Saved places. Entries saved by older versions have a name but no coordinates. */
export interface SavedPlace {
  name: string;
  country?: string;
  admin1?: string;
  lat?: number;
  lon?: number;
}

const loadFavorites = (): SavedPlace[] => {
  const raw = readJson<unknown>(STORAGE_KEYS.favorites, []);
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item): SavedPlace | null => {
      if (typeof item === 'string') return { name: item }; // oldest format
      if (!item || typeof item !== 'object' || typeof item.name !== 'string') return null;
      return {
        name: item.name,
        country: item.country || undefined,
        admin1: item.admin1,
        lat: typeof item.lat === 'number' ? item.lat : undefined,
        lon: typeof item.lon === 'number' ? item.lon : undefined,
      };
    })
    .filter((p): p is SavedPlace => p !== null)
    .slice(0, MAX_FAVORITES);
};

const samePlace = (saved: SavedPlace, place: Place) => {
  if (saved.name.toLowerCase() !== place.name?.toLowerCase()) return false;
  if (saved.lat == null || saved.lon == null) return true;
  return Math.abs(saved.lat - place.lat) < 0.1 && Math.abs(saved.lon - place.lon) < 0.1;
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<SavedPlace[]>(loadFavorites);

  const update = useCallback((fn: (list: SavedPlace[]) => SavedPlace[]) => {
    setFavorites((prev) => {
      const next = fn(prev);
      writeJson(STORAGE_KEYS.favorites, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (place: Place | null) => place != null && favorites.some((f) => samePlace(f, place)),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (place: Place) => {
      if (!place.name) return;
      update((list) =>
        list.some((f) => samePlace(f, place))
          ? list.filter((f) => !samePlace(f, place))
          : [{ name: place.name!, country: place.country, admin1: place.admin1, lat: place.lat, lon: place.lon }, ...list].slice(0, MAX_FAVORITES),
      );
    },
    [update],
  );

  const removeFavorite = useCallback(
    (saved: SavedPlace) => update((list) => list.filter((f) => f !== saved)),
    [update],
  );

  /** Give an old name-only favourite coordinates once the user has opened it */
  const upgradeFavorite = useCallback(
    (place: Place) => {
      update((list) => {
        const idx = list.findIndex((f) => f.lat == null && samePlace(f, place));
        if (idx === -1) return list;
        const next = [...list];
        next[idx] = { ...next[idx], lat: place.lat, lon: place.lon, country: next[idx].country ?? place.country };
        return next;
      });
    },
    [update],
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    upgradeFavorite,
    isFull: favorites.length >= MAX_FAVORITES,
  };
};
