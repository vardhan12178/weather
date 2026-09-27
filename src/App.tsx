import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';
import { SettingsProvider } from './context/SettingsProvider';

const DAY = 24 * 60 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // One quick retry; after that show the error screen with a retry button
      retry: 1,
      // Refresh stale data when the user comes back to the tab/app
      refetchOnWindowFocus: true,
      // Keep results around long enough to be saved for offline use
      gcTime: DAY,
    },
  },
});

// Forecasts are saved to localStorage, so the app opens instantly with the
// last forecast (and works offline) while fresh data loads in the background.
// The saved copy keeps its real fetch time, so "Updated 3 h ago" stays honest.
const persister = createSyncStoragePersister({
  storage: typeof window === 'undefined' ? undefined : window.localStorage,
  key: 'weatherly:cache',
  throttleTime: 1000,
});

const PERSISTED = new Set(['weather', 'place-name', 'snapshot']);

const App = () => (
  <ErrorBoundary>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: DAY,
        // Bump when the cached data shape changes, to discard old caches
        buster: 'v3',
        dehydrateOptions: {
          shouldDehydrateQuery: (q) => q.state.status === 'success' && PERSISTED.has(String(q.queryKey[0])),
        },
      }}
    >
      <SettingsProvider>
        <Home />
      </SettingsProvider>
    </PersistQueryClientProvider>
  </ErrorBoundary>
);

export default App;
