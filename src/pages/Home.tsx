import { useCallback, useEffect, useMemo, useState } from 'react';
import TopBar from '../components/TopBar';
import ErrorState from '../components/ErrorState';
import WeatherBackground from '../features/weather/WeatherBackground';
import WeatherScreen from '../features/weather/WeatherScreen';
import Skeleton from '../features/weather/Skeleton';
import MetricSheet from '../features/weather/details/MetricSheet';
import PlacesSheet from '../features/places/PlacesSheet';
import SettingsSheet from '../features/settings/SettingsSheet';
import { usePlace } from '../features/weather/usePlace';
import { usePlaceName, useWeatherReport } from '../features/weather/queries';
import { DEFAULT_SKY, SKIES, atmosphereFor, skyFor } from '../features/weather/theme';
import type { MetricId } from '../features/weather/metrics';
import { useFavorites, type SavedPlace } from '../features/favorites/useFavorites';
import { useRecentSearches } from '../features/search/useRecentSearches';
import { useSettings } from '../context/settings';
import { STORAGE_KEYS, writeJson } from '../lib/storage';
import { useNow } from '../lib/useNow';
import { formatTemp } from '../lib/units';
import type { Place, WeatherErrorCode } from '../types/weather';

const ago = (ms: number, nowSeconds: number) => {
  const minutes = Math.max(0, Math.floor((nowSeconds * 1000 - ms) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ago`;
};

const Home = () => {
  const { unit } = useSettings();
  const { place, status, error: placeError, isCurrentLocation, selectPlace, searchCity, locate } = usePlace();
  const weather = useWeatherReport(place);
  const placeName = usePlaceName(place);
  const { favorites, isFavorite, toggleFavorite, removeFavorite, upgradeFavorite, isFull } = useFavorites();
  const { recent, addRecent } = useRecentSearches();
  const now = useNow(30_000);

  const [placesOpen, setPlacesOpen] = useState<null | 'browse' | 'search'>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [metric, setMetric] = useState<MetricId | null>(null);

  // The top bar turns compact (and shows the temperature) once the hero scrolls away
  const [heroEl, setHeroEl] = useState<HTMLElement | null>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    if (!heroEl) return;
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { rootMargin: '-64px 0px 0px 0px' });
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [heroEl]);

  // A GPS position gets its name from reverse geocoding
  const resolvedPlace = useMemo<Place | null>(
    () => (place && !place.name && placeName.data ? { ...place, ...placeName.data } : place),
    [place, placeName.data],
  );

  // Remember the last named place (fallback when location is unavailable next time)
  useEffect(() => {
    if (!resolvedPlace?.name) return;
    const { lat, lon, name, country, admin1 } = resolvedPlace;
    writeJson(STORAGE_KEYS.lastPlace, { lat, lon, name, country, admin1 });
    upgradeFavorite(resolvedPlace);
  }, [resolvedPlace, upgradeFavorite]);

  const report = weather.data;
  const sky = report ? skyFor(report.current.condition, report.current.isDay) : DEFAULT_SKY;
  const atmosphere = report ? atmosphereFor(report.current.condition, report.current.isDay, report.current.cloudCover) : [];

  // Match the browser/OS status bar (and the compact top bar) to the sky
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', SKIES[sky].top);
    document.documentElement.style.setProperty('--sky-top-color', SKIES[sky].top);
  }, [sky]);

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

  const handleSelectSaved = useCallback(
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
  const refreshing = weather.isFetching && !weather.isPending;
  const retry =
    error === 'network'
      ? () => (place ? weather.refetch() : locate())
      : error === 'geo-denied' || error === 'geo-unavailable'
        ? locate
        : undefined;

  const updatedLabel = refreshing
    ? 'Updating…'
    : weather.isError && report
      ? `Couldn't update · from ${ago(weather.dataUpdatedAt, now)}`
      : `Updated ${ago(weather.dataUpdatedAt, now)}`;

  const title =
    resolvedPlace?.name ?? (status === 'locating' ? 'Finding you…' : status === 'searching' ? 'Searching…' : isCurrentLocation ? 'My location' : 'Weatherly');

  return (
    <>
      <WeatherBackground sky={sky} atmosphere={atmosphere} />

      <TopBar
        title={title}
        compact={compact && !!report}
        compactLine={report ? `${formatTemp(report.current.temp, unit)} · ${report.current.description}` : undefined}
        isCurrentLocation={!!isCurrentLocation}
        onOpenPlaces={() => setPlacesOpen('browse')}
        onOpenSearch={() => setPlacesOpen('search')}
        onOpenSettings={() => setSettingsOpen(true)}
        favorite={
          report && resolvedPlace?.name
            ? { active: isFavorite(resolvedPlace), disabled: isFull, onToggle: () => toggleFavorite(resolvedPlace) }
            : undefined
        }
      />

      <main className="mx-auto w-full max-w-6xl px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6">
        {loading && <Skeleton />}

        {error && <ErrorState type={error} onOpenSearch={() => setPlacesOpen('search')} onSearch={handleSearch} onRetry={retry} />}

        {!loading && !error && report && resolvedPlace && (
          <WeatherScreen report={report} place={resolvedPlace} unit={unit} status={updatedLabel} heroRef={setHeroEl} onOpenMetric={setMetric} />
        )}
      </main>

      <PlacesSheet
        open={placesOpen != null}
        focusSearch={placesOpen === 'search'}
        onClose={() => setPlacesOpen(null)}
        unit={unit}
        favorites={favorites}
        recent={recent}
        onSelectPlace={handleSelectPlace}
        onSelectSaved={handleSelectSaved}
        onSearch={handleSearch}
        onLocate={locate}
        onRemoveFavorite={removeFavorite}
      />

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onRefresh={() => weather.refetch()}
        refreshing={refreshing}
        updatedLabel={report ? updatedLabel : 'No forecast loaded yet'}
        onLocate={locate}
      />

      {report && <MetricSheet metric={metric} onClose={() => setMetric(null)} report={report} unit={unit} />}
    </>
  );
};

export default Home;
