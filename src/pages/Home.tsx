import { useCallback, useEffect, useMemo, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { Toast, ToastArea } from '../components/Toast';
import TopBar from '../components/TopBar';
import ErrorState from '../components/ErrorState';
import WeatherBackground from '../features/weather/WeatherBackground';
import WeatherScreen from '../features/weather/WeatherScreen';
import Skeleton from '../features/weather/Skeleton';
import MetricSheet from '../features/weather/details/MetricSheet';
import PlacesSheet from '../features/places/PlacesSheet';
import SettingsSheet from '../features/settings/SettingsSheet';
import UpdateToast from '../features/pwa/UpdateToast';
import InstallBanner from '../features/pwa/InstallBanner';
import PullIndicator from '../features/pwa/PullIndicator';
import { usePullToRefresh } from '../features/pwa/usePullToRefresh';
import { useInstallPrompt } from '../features/pwa/useInstallPrompt';

import { usePlace } from '../features/weather/usePlace';
import { usePlaceName, useWeatherReport } from '../features/weather/queries';
import { DEFAULT_SKY, SKIES, atmosphereFor, skyFor, type Sky } from '../features/weather/theme';
import type { MetricId } from '../features/weather/metrics';
import { useFavorites, type SavedPlace } from '../features/favorites/useFavorites';
import { useRecentSearches } from '../features/search/useRecentSearches';
import { useSettings } from '../context/settings';
import { STORAGE_KEYS, readJson, writeJson } from '../lib/storage';
import { useNow } from '../lib/useNow';
import { useOnlineStatus } from '../lib/useOnlineStatus';
import { formatTemp } from '../lib/units';
import type { Place, WeatherErrorCode } from '../types/weather';

/** The sky of the last forecast shown, so a launch doesn't flash a different colour first */
const readLastSky = (): Sky => {
  const key = readJson<{ key?: string } | null>(STORAGE_KEYS.sky, null)?.key;
  return key && key in SKIES ? (key as Sky) : DEFAULT_SKY;
};

const ago = (ms: number, nowSeconds: number) => {
  const minutes = Math.max(0, Math.floor((nowSeconds * 1000 - ms) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ago`;
};

const Home = () => {
  const { unit } = useSettings();
  const { place, status, error: placeError, isCurrentLocation, notice, selectPlace, searchCity, locate, clearNotice } = usePlace();
  const weather = useWeatherReport(place);
  const placeName = usePlaceName(place);
  const { favorites, isFavorite, toggleFavorite, removeFavorite, upgradeFavorite, isFull } = useFavorites();
  const { recent, addRecent } = useRecentSearches();
  const now = useNow(30_000);
  const online = useOnlineStatus();
  const install = useInstallPrompt();

  // The home-screen "Search" shortcut opens the app at /?action=search
  const [placesOpen, setPlacesOpen] = useState<null | 'browse' | 'search'>(() =>
    new URLSearchParams(window.location.search).get('action') === 'search' ? 'search' : null,
  );
  useEffect(() => {
    if (window.location.search) window.history.replaceState(null, '', window.location.pathname);
  }, []);
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

  const report = weather.data;

  // Remember the last place whose forecast actually loaded — the next launch opens
  // there instantly from the offline cache (never on a place with nothing saved)
  useEffect(() => {
    if (!resolvedPlace?.name || !report) return;
    const { lat, lon, name, country, admin1 } = resolvedPlace;
    // Also remember whether it was "my location", so the next launch refines it with GPS
    writeJson(STORAGE_KEYS.lastPlace, { lat, lon, name, country, admin1, isCurrentLocation: !!isCurrentLocation });
    upgradeFavorite(resolvedPlace);
  }, [resolvedPlace, report, isCurrentLocation, upgradeFavorite]);

  const [lastSky] = useState(readLastSky);
  const sky = report ? skyFor(report.current.condition, report.current.isDay) : lastSky;
  const atmosphere = report ? atmosphereFor(report.current.condition, report.current.isDay, report.current.cloudCover) : [];

  // Match the browser/OS status bar (and the compact top bar) to the sky. The
  // inline script in index.html applies the saved colours before the first paint.
  useEffect(() => {
    const { top, bottom } = SKIES[sky];
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', top);
    document.documentElement.style.setProperty('--sky-top-color', top);
    document.documentElement.style.setProperty('--sky-bottom-color', bottom);
    if (report) writeJson(STORAGE_KEYS.sky, { key: sky, top, bottom });
  }, [sky, report]);

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

  // Offline with nothing saved for this place: TanStack pauses the query, so say why
  const offlineNoData = place != null && !report && weather.fetchStatus === 'paused';
  const error: WeatherErrorCode | null =
    placeError ?? (offlineNoData ? 'offline' : weather.isError && !report ? (online ? 'network' : 'offline') : null);
  const loading = !error && (status === 'locating' || status === 'searching' || (place != null && weather.isPending));
  const refreshing = weather.isFetching && !weather.isPending;
  const retry =
    error === 'network' || error === 'offline'
      ? () => (place ? weather.refetch() : locate())
      : error === 'geo-denied' || error === 'geo-unavailable'
        ? locate
        : undefined;

  const updatedLabel = !online
    ? `Offline · updated ${ago(weather.dataUpdatedAt, now)}`
    : refreshing
      ? 'Updating…'
      : weather.isError && report
        ? `Couldn't update · from ${ago(weather.dataUpdatedAt, now)}`
        : `Updated ${ago(weather.dataUpdatedAt, now)}`;

  const refresh = useCallback(() => weather.refetch(), [weather]);
  const { pull, refreshing: pulling } = usePullToRefresh(refresh, !!report && !loading && online);

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

      <PullIndicator pull={pull} refreshing={pulling} />

      {!online && report && (
        <p role="status" className="mx-auto mt-1 flex w-fit items-center gap-2 rounded-full bg-surface-raised/90 px-4 py-2 text-footnote font-semibold shadow-lg">
          <WifiOff size={14} aria-hidden="true" /> You're offline — showing the last saved forecast
        </p>
      )}

      <main
        className="mx-auto w-full max-w-6xl px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] transition-transform sm:px-6"
        style={pull > 0 ? { transform: `translateY(${pull * 0.4}px)` } : undefined}
      >
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
        install={install}
      />

      {report && <MetricSheet metric={metric} onClose={() => setMetric(null)} report={report} unit={unit} />}

      <ToastArea>
        {notice === 'offline-search' && (
          <Toast icon={<WifiOff size={18} />} onDismiss={clearNotice}>
            You're offline. Searching for a new place needs a connection.
          </Toast>
        )}
        <UpdateToast />
        {report && <InstallBanner install={install} />}
      </ToastArea>
    </>
  );
};

export default Home;
