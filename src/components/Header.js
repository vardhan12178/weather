import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Sun, Moon } from 'react-feather';
import VoiceSearch from './VoiceSearch';

const popularCities = [
  'New York', 'London', 'Tokyo', 'Paris', 'Sydney',
  'Mumbai', 'Berlin', 'Moscow', 'Beijing', 'São Paulo'
];

const DarkModeToggle = ({ toggleDarkMode, darkMode }) => (
  <button
    type="button"
    onClick={toggleDarkMode}
    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
  </button>
);

const Header = ({ setLocation, setCoordinates, toggleDarkMode, darkMode }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved);
  }, []);

  useEffect(() => {
    if (input.trim()) {
      const filtered = [...new Set([...recentSearches, ...popularCities])]
        .filter(city => city.toLowerCase().includes(input.toLowerCase()));
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
    setActiveSuggestion(-1);
  }, [input, recentSearches]);

  const updateRecent = city => {
    const updated = [city, ...recentSearches.filter(c => c !== city)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const city = input.trim();
    if (city && /^[a-zA-Z\s,]+$/.test(city)) {
      setIsLoading(true);
      setLocation(city);
      updateRecent(city);
      setInput('');
      setShowSuggestions(false);
      setIsLoading(false);
      setIsSearchOpen(false);
    }
  };

  const handleSuggestionClick = city => {
    setLocation(city);
    updateRecent(city);
    setInput('');
    setShowSuggestions(false);
    setIsSearchOpen(false);
  };

  const handleKeyDown = e => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (activeSuggestion >= 0) {
        e.preventDefault();
        handleSuggestionClick(suggestions[activeSuggestion]);
      }
    }
  };

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGeolocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        pos => {
          setCoordinates({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setIsGeolocationLoading(false);
        },
        () => setIsGeolocationLoading(false)
      );
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h1 className={`font-poppins text-gray-800 dark:text-white transition-all duration-300 ${isSearchOpen ? 'text-lg' : 'text-2xl sm:text-3xl'} font-bold`}>Weatherly</h1>
            </div>
            <form onSubmit={handleSubmit} className="hidden md:flex items-center space-x-3 flex-1 w-full max-w-lg mx-4 relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for a city..."
                  aria-label="Search for a city or location"
                  className="w-full p-3 pl-10 pr-20 text-sm sm:text-base rounded-full shadow-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white bg-white/80 backdrop-blur-sm transition-all duration-300"
                />
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <VoiceSearch setLocation={setLocation} />
                </div>
                {input && (
                  <button type="button" onClick={() => setInput('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Clear search input">
                    <X size={20} />
                  </button>
                )}
                {showSuggestions && (
                  <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 rounded-md shadow max-h-60 overflow-auto mt-1">
                    {suggestions.map((city, idx) => (
                      <li
                        key={city}
                        onMouseDown={() => handleSuggestionClick(city)}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${activeSuggestion === idx ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-transform hover:scale-105 flex items-center" disabled={isLoading}>
                {isLoading ? <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> : 'Search'}
              </button>
            </form>
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={fetchCurrentLocation} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Use my location" disabled={isGeolocationLoading}>
                {isGeolocationLoading ? <svg className="animate-spin h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> : <MapPin size={20} className="text-gray-600 dark:text-gray-300"/>}
              </button>
              <DarkModeToggle toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            </div>
            <div className="md:hidden flex items-center space-x-3"> 
              {!isSearchOpen ? (
                <>                
                  <button onClick={() => setIsSearchOpen(true)} aria-label="Open search">
                    <Search size={24} className="text-gray-600 dark:text-gray-300" />
                  </button>
                  <button onClick={fetchCurrentLocation} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Use my location" disabled={isGeolocationLoading}>
                    {isGeolocationLoading ? <svg className="animate-spin h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> : <MapPin size={20} className="text-gray-600 dark:text-gray-300"/>}
                  </button>
                  <DarkModeToggle toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </>
              ) : null}
            </div>
          </div>
         {isSearchOpen && (
  <div className="md:hidden p-4 bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md">
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a city..."
        aria-label="Search for a city or location"
        autoFocus
        className="w-full p-3 pl-10 pr-12 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 dark:bg-gray-700 dark:bg-opacity-20 backdrop-blur-sm text-gray-800 dark:text-white"
      />
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <VoiceSearch setLocation={setLocation} />
      </div>
      <button
        type="button"
        onClick={() => setIsSearchOpen(false)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label="Close search"
      >
        <X size={20} />
      </button>
    </form>
  </div>
)}

        </div>
      </nav>
    </header>
  );
};

export default Header;
