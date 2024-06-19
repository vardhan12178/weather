import { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';
import VoiceSearch from './VoiceSearch';

const Header = ({ setLocation, toggleDarkMode, darkMode }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      setLocation(input);
      setInput('');
    }
  };

  return (
    <header className="mb-5 w-full">
      <nav className="bg-gradient-to-r from-blue-800 to-purple-800 dark:from-gray-700 dark:to-gray-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-yellow-200 dark:text-yellow-200 text-center flex-1 tracking-tight">
              Weather Dashboard
            </h1>
            <div className="ml-4">
              <DarkModeToggle toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            </div>
          </div>
        </div>
      </nav>
      <div className="mt-6 flex justify-center px-4 sm:px-0">
        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter city" 
              className="w-full p-2 pl-12 pr-20 text-sm sm:text-lg rounded-lg shadow-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white bg-white text-gray-800" 
            />
            <div className="absolute items-center mt-1.5 right-14 top-1/2 transform -translate-y-1/2">
              <VoiceSearch setLocation={setLocation} />
            </div>
            <button 
              type="submit" 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors dark:bg-gray-900 dark:hover:bg-gray-500 dark:focus:ring-2 dark:focus:ring-gray-500 dark:focus:outline-none"
              style={{ top: '50%' }}
            >
              Search
            </button>
          </div>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg 
              className="w-5 h-5 text-gray-500 dark:text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 1 0-14 0 7 7 0 0 0 14 0z" 
              />
            </svg>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
