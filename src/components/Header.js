// src/components/Header.js
import { useState, useEffect } from 'react';
import { Search, MapPin, Settings, X, Sun, Moon } from 'react-feather';
import VoiceSearch from './VoiceSearch';

const DarkModeToggle = ({ toggleDarkMode, darkMode }) => (
  <button
    onClick={toggleDarkMode}
    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {darkMode ? (
      <Sun size={20} className="text-yellow-400" />
    ) : (
      <Moon size={20} className="text-gray-600" />
    )}
  </button>
);

const Header = ({ setLocation, setCoordinates, toggleDarkMode, darkMode }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false); // New state for geolocation loading
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSettingsTooltip, setShowSettingsTooltip] = useState(false);
  const [unit, setUnit] = useState('metric'); // New state for temperature unit

  // Show settings tooltip on first load
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('hasSeenSettingsTooltip');
    if (!hasSeenTooltip) {
      setShowSettingsTooltip(true);
      localStorage.setItem('hasSeenSettingsTooltip', 'true');
    }
  }, []);

  // Auto-hide settings tooltip after 5 seconds
  useEffect(() => {
    if (showSettingsTooltip) {
      const timer = setTimeout(() => {
        setShowSettingsTooltip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSettingsTooltip]);

  // Close tooltip and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.settings-button')) {
        setShowSettingsTooltip(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && /^[a-zA-Z\s,]+$/.test(trimmedInput)) {
      setIsLoading(true);
      setLocation(trimmedInput);
      setInput('');
      setIsLoading(false);
      setIsSearchOpen(false);
    } else {
      alert('Please enter a valid city name.');
    }
  };

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGeolocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setIsGeolocationLoading(false);
        },
        (err) => {
          console.error(err);
          alert('Unable to retrieve your location. Please ensure location permissions are enabled.');
          setIsGeolocationLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsGeolocationLoading(false);
    }
  };

  const clearInput = () => {
    setInput('');
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    // You can pass this unit to the parent component or store it globally to update the app's temperature units
    console.log(`Temperature unit changed to: ${newUnit}`);
  };

  return (
    <header className="w-full sticky top-0 z-50"> {/* Increased z-index to 50 */}
      <nav className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h1
                className={`font-poppins text-gray-800 dark:text-white transition-all duration-300 ${
                  isSearchOpen ? 'text-lg' : 'text-2xl sm:text-3xl'
                } font-bold`}
              >
                Weatherly
              </h1>
            </div>

            {/* Search Bar (Desktop) */}
            <form
              onSubmit={handleSubmit}
              className="hidden md:flex items-center space-x-3 flex-1 w-full max-w-lg mx-4 relative" // Updated max-w-md to w-full max-w-lg
            >
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Search for a city..."
                  aria-label="Search for a city or location"
                  className="w-full p-3 pl-10 pr-20 text-sm sm:text-base rounded-full shadow-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white bg-white/80 backdrop-blur-sm transition-all duration-300"
                />
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <VoiceSearch setLocation={setLocation} />
                </div>
                {input && (
                  <button
                    type="button"
                    onClick={clearInput}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search input"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-transform duration-300 transform hover:scale-105 flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  'Search'
                )}
              </button>
            </form>

            {/* Right Side Actions (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={fetchCurrentLocation}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Use my location"
                disabled={isGeolocationLoading}
              >
                {isGeolocationLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-600 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  <MapPin size={20} className="text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <DarkModeToggle toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-3">
              {!isSearchOpen && (
                <>
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Open search"
                  >
                    <Search size={24} className="text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={fetchCurrentLocation}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Use my location"
                    disabled={isGeolocationLoading}
                  >
                    {isGeolocationLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-gray-600 dark:text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                    ) : (
                      <MapPin size={20} className="text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                  <DarkModeToggle toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </>
              )}
              <div className="relative settings-button">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Open settings"
                >
                  {isMenuOpen ? (
                    <X size={24} className="text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Settings size={24} className="text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                {showSettingsTooltip && !isMenuOpen && (
                  <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Settings
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar (Expands when search icon is clicked) */}
          {isSearchOpen && (
            <div className="md:hidden p-4 bg-white dark:bg-gray-800">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Search for a city..."
                  aria-label="Search for a city or location"
                  className="w-full p-3 pl-10 pr-20 text-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white bg-white/80 backdrop-blur-sm"
                  autoFocus
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

          {/* Mobile Menu (Settings) */}
          {isMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-4 space-y-4">
                {/* Temperature Unit Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 dark:text-gray-300 font-poppins">
                    Temperature Unit
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUnitChange('metric')}
                      className={`px-3 py-1 rounded-full ${
                        unit === 'metric'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      } transition-colors`}
                    >
                      °C
                    </button>
                    <button
                      onClick={() => handleUnitChange('imperial')}
                      className={`px-3 py-1 rounded-full ${
                        unit === 'imperial'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      } transition-colors`}
                    >
                      °F
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-center font-poppins">
                  More settings (e.g., language) coming soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;