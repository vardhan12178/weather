// localStorage can throw (private mode, quota, blocked cookies) or hold stale
// data from older app versions — always read and write through these helpers.

export const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
};

export const writeJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — the app still works, it just won't remember */
  }
};

export const STORAGE_KEYS = {
  unit: 'weatherly:unit',
  lastPlace: 'weatherly:lastPlace',
  installDismissed: 'weatherly:installDismissed',
  // Legacy names kept so existing users don't lose their data
  favorites: 'weatherFavorites',
  recentSearches: 'recentSearches',
} as const;
