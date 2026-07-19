import React, { useState } from 'react';
import { CloudRain, Navigation, Search, X } from 'react-feather';
import SearchBox from './Search/SearchBox';

const Header = ({ setLocation, setCoordinates }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  const handleSearch = (term) => {
    setLocation(term);
    setIsSearchOpen(false);
    setLocationMessage('');
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not supported by this browser.');
      return;
    }

    setIsLocating(true);
    setLocationMessage('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({ lat: coords.latitude, lon: coords.longitude });
        setIsLocating(false);
      },
      () => {
        setLocationMessage('Location access was blocked. Search for a city instead.');
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <header className="premium-header">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8" aria-label="Weather navigation">
        <a href="#top" className="flex shrink-0 items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-white dark:text-slate-950">
            <CloudRain size={20} strokeWidth={2.2} />
          </span>
          <span className="leading-none">
            <span className="block text-base font-extrabold tracking-[-0.04em] text-slate-950 dark:text-white">Weatherly</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Live intelligence</span>
          </span>
        </a>

        <div className="hidden min-w-0 flex-1 md:block">
          <SearchBox onSearch={handleSearch} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={fetchCurrentLocation} disabled={isLocating} className="premium-action header-location-desktop" aria-label="Use my current location">
            {isLocating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Navigation size={17} />}
            <span>{isLocating ? 'Locating' : 'My location'}</span>
          </button>

          <button type="button" onClick={fetchCurrentLocation} disabled={isLocating} className="premium-icon-button header-mobile-action" aria-label="Use my current location">
            {isLocating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Navigation size={18} />}
          </button>
          <button type="button" onClick={() => setIsSearchOpen((open) => !open)} className="premium-icon-button header-mobile-action" aria-label={isSearchOpen ? 'Close search' : 'Open search'} aria-expanded={isSearchOpen}>
            {isSearchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="mx-auto w-full max-w-7xl px-4 pb-4 md:hidden">
          <SearchBox onSearch={handleSearch} isMobileOpen />
        </div>
      )}

      <p className="sr-only" aria-live="polite">{locationMessage}</p>
      {locationMessage && (
        <div className="mx-auto w-full max-w-7xl px-4 pb-3 text-right text-xs font-semibold text-amber-800 dark:text-amber-200 sm:px-6 lg:px-8">
          {locationMessage}
        </div>
      )}
    </header>
  );
};

export default Header;
