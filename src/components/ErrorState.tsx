import { MapPin, Navigation, RefreshCw, Search, WifiOff, type LucideIcon } from 'lucide-react';
import { quickCities } from '../features/search/popularCities';
import type { WeatherErrorCode } from '../types/weather';

// Copy for each failure type, so users know what actually went wrong
const MESSAGES: Record<WeatherErrorCode, { icon: LucideIcon; title: string; body: string }> = {
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
  onOpenSearch: () => void;
  onSearch: (term: string) => void;
  onRetry?: () => void;
}

const ErrorState = ({ type, onOpenSearch, onSearch, onRetry }: ErrorStateProps) => {
  const { icon: Icon, title, body } = MESSAGES[type];

  return (
    <section role="alert" className="mx-auto flex max-w-sm flex-col items-center py-16 text-center animate-fade-up">
      <span className="glass grid h-16 w-16 place-items-center rounded-3xl">
        <Icon size={28} aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-title font-semibold">{title}</h1>
      <p className="mt-2 text-body text-white/85">{body}</p>

      <div className="mt-6 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-body font-semibold text-slate-900 shadow-lg hover:bg-white/90"
        >
          <Search size={18} aria-hidden="true" /> Search for a city
        </button>
        {onRetry && (
          <button type="button" onClick={onRetry} className="glass flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-body font-semibold">
            <RefreshCw size={16} aria-hidden="true" /> Try again
          </button>
        )}
      </div>

      <p className="mt-8 text-footnote font-semibold text-white/85">Popular cities</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {quickCities.slice(0, 6).map((city) => (
          <button key={city} type="button" onClick={() => onSearch(city)} className="glass min-h-11 rounded-full px-4 text-body hover:bg-[rgb(8_20_45/0.45)]">
            {city}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ErrorState;
