import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';
import { SettingsProvider } from './context/SettingsProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // One quick retry; after that show the error screen with a retry button
      retry: 1,
      // Refresh stale data when the user comes back to the tab/app
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <Home />
      </SettingsProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
