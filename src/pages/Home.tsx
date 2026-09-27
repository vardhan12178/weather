import { lazy, Suspense, useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import Header from '../components/Header';
import ErrorState from '../components/ErrorState';
import ErrorBoundary from '../components/ErrorBoundary';
import WeatherDashboard, { DashboardSkeleton } from '../features/weather/WeatherDashboard';
import { usePlace } from '../features/weather/usePlace';
import { usePlaceName, useWeatherReport } from '../features/weather/queries';
import { useFavorites, type SavedPlace } from '../features/favorites/useFavorites';
import { useRecentSearches } from '../features/search/useRecentSearches';
import { useSettings } from '../context/settings';
import { STORAGE_KEYS, writeJson } from '../lib/storage';
import type { Condition, Place, WeatherErrorCode } from '../types/weather';

// three.js is big: load the 3D backdrop only once there's weather to show
const SceneBackground = lazy(() => import('../features/scene/SceneBackground'));

const BACKGROUNDS: Record<Condition, string> = {
  Clear: 'bg-linear-to-b from-sky-300 via-sky-200 to-indigo-100',
  Clouds: 'bg-linear-to-b from-slate-300 via-slate-200 to-blue-100',
  Rain: 'bg-linear-to-b from-slate-400 via-slate-300 to-sky-200',
  Drizzle: 'bg-linear-to-b from-slate-400 via-slate-300 to-sky-200',
  Thunderstorm: 'bg-linear-to-b from-slate-500 via-slate-400 to-indigo-300',
  Snow: 'bg-linear-to-b from-sky-100 via-blue-50 to-slate-100',
  Fog: 'bg-linear-to-b from-slate-200 via-slate-100 to-blue-100',
};
const NIGHT_BACKGROUND = 'bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900';
const DEFAULT_BACKGROUND = 'bg-linear-to-b from-sky-100 via-blue-50 to-indigo-100';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const prefersReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;

const Home = () => {
  const { unit, toggleUnit } = useSettings();
  const { place, status, error: placeError, selectPlace, searchCity, locate } = usePlace();
  const weather = useWeatherReport(place);
  const placeName = usePlaceName(place);
  const { favorites, isFavorite, toggleFavorite, removeFavorite, upgradeFavorite, isFull } = useFavorites();
  const { recent, addRecent } = useRecentSearches();
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion);

  // A GPS position gets its name from reverse geocoding
  const resolvedPlace = useMemo<Place | null>(
    () => (place && !place.name && placeName.data ? { ...place, ...placeName.data } : place),
    [place, placeName.data],
  );

  // Remember the last named place (fallback when location is unavailable next time)
  useEffect(() => {
    if (!resolvedPlace?.name) return;
    writeJson(STORAGE_KEYS.lastPlace, resolvedPlace);
    upgradeFavorite(resolvedPlace);
  }, [resolvedPlace, upgradeFavorite]);

  const report = weather.data;
  const isDay = report ? report.current.isDay : true;

  // Night theme for the whole page
  useEffect(() => {
    document.documentElement.classList.toggle('dark', !isDay);
  }, [isDay]);

  const handleSearch = useCallback(
    (term: string) => {
      addRecent(term);
      searchCity(term);
    },
    [addRecent, searchCity],
  );

  const handleSelectPlace = useCallback(
    (p: Place) => {
      if (p.name) addRecent(p.name);
      selectPlace(p);
    },
    [addRecent, selectPlace],
  );

  const handleSelectFavorite = useCallback(
    (saved: SavedPlace) => {
      if (saved.lat != null && saved.lon != null) {
        selectPlace({ lat: saved.lat, lon: saved.lon, name: saved.name, country: saved.country, admin1: saved.admin1 });
      } else {
        searchCity(saved.name);
      }
    },
    [selectPlace, searchCity],
  );

  const error: WeatherErrorCode | null = placeError ?? (weather.isError && !report ? 'network' : null);
  const loading = !error && (status === 'locating' || status === 'searching' || (place != null && weather.isPending));
  const retry =
    error === 'network'
      ? () => (place ? weather.refetch() : locate())
      : error === 'geo-denied' || error === 'geo-unavailable'
        ? locate
        : undefined;

  const background = !report ? DEFAULT_BACKGROUND : isDay ? BACKGROUNDS[report.current.condition] : NIGHT_BACKGROUND;

  return (
    <div className={`relative w-full min-h-screen overflow-hidden transition-all duration-1000 ${background}`}>
      {report && !reducedMotion && (
        <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isDay ? 'opacity-80' : 'opacity-95'}`}>
          {/* Decorative: if the 3D scene fails, drop it and keep the forecast */}
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <SceneBackground condition={report.current.condition} isDay={isDay} />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}

      {/* Soft light bloom + gentle vignette so content reads cleanly over the sky */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.45),rgba(255,255,255,0)_55%)]" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-b from-white/0 via-white/0 to-black/10 dark:to-black/25" />

      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        <Header
          onSearch={handleSearch}
          onSelectPlace={handleSelectPlace}
          onLocate={locate}
          locating={status === 'locating'}
          recent={recent}
        />

        <main className="grow w-full overflow-y-auto overflow-x-hidden flex flex-col items-center pb-12 px-4 sm:px-6 lg:px-8">
          {loading && <DashboardSkeleton />}

          {error && (
            <div className="z-50 w-full h-full flex items-center justify-center p-4">
              <ErrorState
                type={error}
                onSearch={handleSearch}
                onSelectPlace={handleSelectPlace}
                onRetry={retry}
                recent={recent}
              />
            </div>
          )}

          {!loading && !error && report && resolvedPlace && (
            <WeatherDashboard
              report={report}
              place={resolvedPlace}
              unit={unit}
              onToggleUnit={toggleUnit}
              onRefresh={() => weather.refetch()}
              refreshing={weather.isFetching && !weather.isPending}
              favorites={favorites}
              isFavorite={isFavorite(resolvedPlace)}
              canAddFavorite={!isFull && !!resolvedPlace.name}
              onToggleFavorite={() => toggleFavorite(resolvedPlace)}
              onSelectFavorite={handleSelectFavorite}
              onRemoveFavorite={removeFavorite}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
