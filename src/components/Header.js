import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Sun, Moon } from 'react-feather';
import VoiceSearch from './VoiceSearch';
import RecentSearches from './RecentSearches';

const popularCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
];

const Header = ({ setLocation, setCoordinates, darkMode }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
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
    } else {
      setSuggestions([]);
    }
  }, [input, recentSearches]);

  const updateRecent = city => {
    const updated = [city, ...recentSearches.filter(c => c !== city)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleSearch(input);
  };

  const handleSearch = (city) => {
    const term = city.trim();
    if (term && /^[a-zA-Z\s,]+$/.test(term)) {
      setIsLoading(true);
      setLocation(term);
      updateRecent(term);
      setInput('');
      setIsFocused(false);
      setIsLoading(false);
      setIsSearchOpen(false);
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

  // Logic to determine if dropdown should show
  const showDropdown = isFocused && (suggestions.length > 0 || (!input && recentSearches.length > 0));

  return (
    <header className="relative z-50 w-full pt-6 px-4 lg:px-8">
      <nav className="w-full flex items-center justify-between h-16">
        
        {/* DYNAMIC LOGO SECTION */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          {/* Icon changes based on Day/Night */}
          <div className={`p-2.5 rounded-xl shadow-lg transition-all duration-500 ${
            darkMode 
              ? 'bg-indigo-900/50 shadow-indigo-500/20 text-indigo-200' // Night Style
              : 'bg-orange-100 shadow-orange-500/20 text-orange-500'    // Day Style
          }`}>
              {darkMode ? (
                <Moon className="w-6 h-6 fill-current" />
              ) : (
                <Sun className="w-6 h-6 fill-current" />
              )}
          </div>
          <h1 className="font-sans text-2xl font-black tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
            Weatherly
          </h1>
        </div>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSubmit} className="hidden md:flex items-center relative w-full max-w-lg mx-auto group">
          <div className="relative w-full transition-transform duration-300 group-focus-within:scale-105">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)} 
              placeholder="Search city..."
              className="w-full py-3 pl-12 pr-14 rounded-full bg-white/80 dark:bg-black/30 border border-white/20 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-xl shadow-lg transition-all"
            />
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {input && (
                <button type="button" onClick={() => setInput('')} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                  <X size={16} />
                </button>
              )}
              <div className="border-l border-gray-300 dark:border-white/10 pl-2">
                <VoiceSearch setLocation={handleSearch} />
              </div>
            </div>

            {/* UNIFIED DROPDOWN */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in slide-in-from-top-2 p-2">
                {input && suggestions.length > 0 && (
                  <ul>
                    {suggestions.map((city, idx) => (
                      <li
                        key={city}
                        onClick={() => handleSearch(city)}
                        className="px-4 py-3 cursor-pointer flex items-center space-x-3 hover:bg-blue-500/10 rounded-xl transition-colors"
                      >
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{city}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {!input && recentSearches.length > 0 && (
                  <div className="p-2">
                      <RecentSearches searches={recentSearches} onSearch={handleSearch} />
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={fetchCurrentLocation} 
            className="p-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 text-gray-700 dark:text-white transition-all shadow-sm backdrop-blur-md group"
            title="Use my location"
            disabled={isGeolocationLoading}
          >
              {isGeolocationLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <MapPin size={20} className="group-hover:scale-110 transition-transform" />
              )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-3">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-800 dark:text-white bg-white/10 rounded-full backdrop-blur-md">
            {isSearchOpen ? <X size={24} /> : <Search size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Search Expand */}
      {isSearchOpen && (
        <div className="md:hidden pt-4 pb-2 px-1 animate-in slide-in-from-top-5 fade-in">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search city..."
              className="w-full p-4 pl-5 pr-12 rounded-2xl bg-white/80 dark:bg-black/40 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl backdrop-blur-xl"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <VoiceSearch setLocation={handleSearch} />
            </div>
          </form>
          {!input && recentSearches.length > 0 && (
             <div className="mt-4 px-2">
                <RecentSearches searches={recentSearches} onSearch={handleSearch} />
             </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;