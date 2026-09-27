import { useCallback, useState } from 'react';
import { readJson, STORAGE_KEYS, writeJson } from '../../lib/storage';

const MAX_RECENT = 5;

const loadRecent = (): string[] => {
  const raw = readJson<unknown>(STORAGE_KEYS.recentSearches, []);
  return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === 'string').slice(0, MAX_RECENT) : [];
};

export const useRecentSearches = () => {
  const [recent, setRecent] = useState<string[]>(loadRecent);

  const addRecent = useCallback((term: string) => {
    setRecent((prev) => {
      const next = [term, ...prev.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT);
      writeJson(STORAGE_KEYS.recentSearches, next);
      return next;
    });
  }, []);

  return { recent, addRecent };
};
