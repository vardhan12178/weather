import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none transition-colors duration-300 ease-in-out"
    >
      {/* Toggle Circle */}
      <div
        className={`absolute top-1/2 left-1 w-7 h-7 rounded-full bg-white dark:bg-gray-900 shadow-md transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${
          darkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {/* Icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          {darkMode ? (
            <FiSun className="w-4 h-4 text-yellow-400" />
          ) : (
            <FiMoon className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </div>
    </button>
  );
};

export default DarkModeToggle;