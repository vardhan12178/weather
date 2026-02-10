import React, { useState } from 'react';
import { MapPin, Search, X } from 'react-feather';
import SearchBox from './Search/SearchBox';

const Header = ({ setLocation, setCoordinates, darkMode }) => {
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (term) => {
    setLocation(term);
    setIsSearchOpen(false);
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsGeolocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setIsGeolocationLoading(false);
      },
      () => setIsGeolocationLoading(false)
    );
  };

  return (
    <header className="relative z-50 w-full pt-5 px-4 lg:px-8">
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 h-16">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl shadow-lg transition-all duration-300 ${
              darkMode ? 'bg-slate-900/60 text-sky-200 border border-white/10' : 'bg-sky-100/80 text-sky-700 border border-white/60'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
          </div>
          <div className="leading-tight">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Weatherly</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">Live conditions</p>
          </div>
        </div>

        <div className="hidden md:block flex-1 max-w-xl">
          <SearchBox onSearch={handleSearch} />
        </div>

        <div className="hidden md:flex items-center">
          <button
            onClick={fetchCurrentLocation}
            className="inline-flex items-center justify-center p-3 rounded-full bg-white/70 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-100 transition-all shadow-sm backdrop-blur-md"
            title="Use my location"
            disabled={isGeolocationLoading}
          >
            {isGeolocationLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <MapPin size={16} />
            )}
          </button>
        </div>

        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={fetchCurrentLocation}
            className="p-2.5 text-gray-800 dark:text-white bg-white/30 dark:bg-black/20 rounded-full backdrop-blur-md border border-white/20"
            disabled={isGeolocationLoading}
          >
            {isGeolocationLoading ? <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : <MapPin size={20} />}
          </button>

          <button
            onClick={() => setIsSearchOpen((open) => !open)}
            className="p-2.5 text-gray-800 dark:text-white bg-white/30 dark:bg-black/20 rounded-full backdrop-blur-md border border-white/20"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="md:hidden mt-3 w-full max-w-7xl mx-auto">
          <SearchBox onSearch={handleSearch} isMobileOpen={isSearchOpen} />
        </div>
      )}
    </header>
  );
};

export default Header;
