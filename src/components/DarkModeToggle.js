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
      className="absolute top-4 right-4 p-1 bg-gray-200 dark:bg-gray-800 rounded-full shadow-lg focus:outline-none"
    >
      {darkMode ? <FiSun size={24} color="#FFD700" /> : <FiMoon size={24} color="#4A5568" />}
    </button>
  );
};

export default DarkModeToggle;
