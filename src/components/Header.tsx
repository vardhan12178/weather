import { useState } from 'react';
import { MapPin, Search, X, CloudRain } from 'react-feather';
import SearchBox from '../features/search/SearchBox';
import type { Place } from '../types/weather';

interface HeaderProps {
  onSearch: (term: string) => void;
  onSelectPlace: (place: Place) => void;
  onLocate: () => void;
  locating: boolean;
  recent: string[];
}

const locateButton =
  'w-10 h-10 flex items-center justify-center rounded-full bg-white/60 dark:bg-white/5 hover:bg-brand-500 hover:text-white text-slate-700 dark:text-slate-100 border border-white/70 dark:border-white/10 hover:border-brand-500 shadow-soft backdrop-blur-md transition-all duration-200 active:scale-95 disabled:opacity-50';

const Spinner = () => <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />;

const Header = ({ onSearch, onSelectPlace, onLocate, locating, recent }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (term: string) => {
    onSearch(term);
    setIsSearchOpen(false);
  };

  const handleSelect = (place: Place) => {
    onSelectPlace(place);
    setIsSearchOpen(false);
  };

  return (
    <header className="relative z-50 w-full pt-5 px-4 lg:px-8">
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 h-16 px-1 sm:px-2">
        {/* Logo */}
        <div className="flex items-center gap-3 group select-none">
          <div className="relative grid place-items-center w-10 h-10 rounded-2xl bg-linear-to-br from-brand-400 to-brand-600 text-white shadow-soft group-hover:scale-105 transition-transform duration-300">
            <CloudRain size={19} />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Weatherly</h1>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300 font-semibold">
              Live forecast
            </p>
          </div>
        </div>

        {/* Center search (desktop) */}
        <div className="hidden md:block flex-1 max-w-md mx-auto">
          <SearchBox onSearch={handleSearch} onSelectPlace={handleSelect} recent={recent} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLocate}
            disabled={locating}
            className={locateButton}
            title="Use my location"
            aria-label="Use my location"
          >
            {locating ? <Spinner /> : <MapPin size={16} />}
          </button>

          <button
            type="button"
            onClick={() => setIsSearchOpen((open) => !open)}
            className={`md:hidden ${locateButton}`}
            title="Toggle search"
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={isSearchOpen}
          >
            {isSearchOpen ? <X size={16} /> : <Search size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div className="md:hidden mt-3 w-full max-w-7xl mx-auto px-1 animate-fadeIn">
          <SearchBox onSearch={handleSearch} onSelectPlace={handleSelect} recent={recent} isMobileOpen />
        </div>
      )}
    </header>
  );
};

export default Header;
