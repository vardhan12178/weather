import { motion } from 'framer-motion';
import { MapPin, WifiOff, Navigation, RefreshCw, type Icon } from 'react-feather';
import SearchBox from '../features/search/SearchBox';
import { quickCities } from '../features/search/popularCities';
import type { Place, WeatherErrorCode } from '../types/weather';

// Copy for each failure type, so users know what actually went wrong
const MESSAGES: Record<WeatherErrorCode, { icon: Icon; title: string; body: string }> = {
  'not-found': {
    icon: MapPin,
    title: 'Location not found',
    body: 'Check the spelling or try another city.',
  },
  network: {
    icon: WifiOff,
    title: "Couldn't load the weather",
    body: 'Check your internet connection and try again.',
  },
  'geo-denied': {
    icon: Navigation,
    title: 'Where should we look?',
    body: 'Location access is off. Search for a city to see its forecast.',
  },
  'geo-unavailable': {
    icon: Navigation,
    title: 'Where should we look?',
    body: "We couldn't detect your location. Search for a city to see its forecast.",
  },
};

interface ErrorStateProps {
  type: WeatherErrorCode;
  onSearch: (term: string) => void;
  onSelectPlace: (place: Place) => void;
  onRetry?: () => void;
  recent: string[];
}

const ErrorState = ({ type, onSearch, onSelectPlace, onRetry, recent }: ErrorStateProps) => {
  const { icon: Icon, title, body } = MESSAGES[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      role="alert"
      className="flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto px-6 py-10"
    >
      <div className="grid place-items-center w-16 h-16 rounded-3xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 shadow-soft mb-6">
        <Icon size={26} className="text-slate-400 dark:text-slate-300" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-300/80 mt-2 leading-relaxed">{body}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 min-h-11 px-5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-soft transition-colors"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}

      {/* The header search is hidden behind a button on mobile — show it inline here */}
      <div className="md:hidden mt-6 w-full text-left">
        <SearchBox onSearch={onSearch} onSelectPlace={onSelectPlace} recent={recent} isMobileOpen autoFocus={false} />
      </div>

      <div className="mt-7 w-full">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Popular cities
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {quickCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onSearch(city)}
              className="flex items-center gap-1.5 px-3.5 py-2 min-h-11 rounded-full bg-white/70 dark:bg-white/10 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 text-slate-700 dark:text-slate-200 text-sm font-medium border border-white/60 dark:border-white/10 shadow-soft transition-all active:scale-95"
            >
              <MapPin size={13} className="opacity-60" />
              {city}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorState;
