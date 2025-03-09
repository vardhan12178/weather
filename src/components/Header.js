import { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';
import VoiceSearch from './VoiceSearch';

// Reusable Search Icon Component
const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const Header = ({ setLocation, toggleDarkMode, darkMode }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && /^[a-zA-Z\s,]+$/.test(trimmedInput)) {
      setLocation(trimmedInput);
      setInput('');
    } else {
      alert('Please enter a valid city name.');
    }
  };

  return (
    <header className="w-full">
      <nav className="bg-white/30 dark:bg-gray-800/50 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/50">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Weatherly
              </h1>
            </div>

            {/* Dark Mode Toggle with Tooltip */}
            <div className="relative flex items-center group">
              <DarkModeToggle toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
              
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="mt-8 flex justify-center px-4 sm:px-0">
        <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
          <div className="relative flex items-center">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon />
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for a city, e.g., Delhi ..."
              aria-label="Search for a city or location"
              className="w-full p-3 pl-10 pr-32 text-sm sm:text-base rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white bg-white/80 backdrop-blur-sm"
            />

            {/* Voice Search with Tooltip */}
            <div className="absolute inset-y-0 right-24 flex items-center group">
              <VoiceSearch setLocation={setLocation} />
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Voice Search
              </span>
            </div>

            {/* Search Button with Icon */}
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-sm sm:text-base bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <span className="ml-2">Search</span>
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;