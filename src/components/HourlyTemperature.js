// src/components/HourlyTemperature.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'react-feather';

const HourlyTemperature = ({ lat, lon }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 6; // 6 intervals per page (2 rows of 3)

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=30755a4a95cbde88af53afaafad1ea50&units=metric`
        );
        const allData = response.data.list.slice(0, 9); // Fetch 9 intervals (27 hours)
        setHourlyData(allData);
        setDisplayedData(allData.slice(0, itemsPerPage)); // Initially display first 6 intervals
        setLoading(false);
      } catch (err) {
        setError('Unable to fetch hourly temperature data.');
        setLoading(false);
      }
    };

    if (lat && lon) {
      fetchHourlyData();
    }
  }, [lat, lon]);

  const totalPages = Math.ceil(hourlyData.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const startIndex = nextPage * itemsPerPage;
      setDisplayedData(hourlyData.slice(startIndex, startIndex + itemsPerPage));
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      const startIndex = prevPage * itemsPerPage;
      setDisplayedData(hourlyData.slice(startIndex, startIndex + itemsPerPage));
    }
  };

  if (loading) return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-gray-600 dark:text-gray-300 drop-shadow-sm">Loading hourly data...</p>
    </div>
  );

  if (error) return (
    <div className="text-center bg-red-100/90 dark:bg-red-900/30 p-4 rounded-lg">
      <p className="text-red-500 dark:text-red-300 drop-shadow-sm">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  if (!hourlyData.length) return (
    <div className="text-center">
      <p className="text-gray-500 dark:text-gray-400 drop-shadow-sm">No hourly data available.</p>
    </div>
  );

  const toggleTooltip = (key) => {
    setShowTooltip((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cardClasses = "flex flex-col items-center bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-4 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-300 group relative min-w-[150px] border border-gray-200/50 dark:border-gray-700/50";

  return (
    <div className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 text-center text-gray-800 dark:text-white border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-poppins drop-shadow-md">Hourly Temperature</h2>
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, x: currentPage > 0 ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: currentPage > 0 ? -20 : 20 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {displayedData.map((hour, index) => {
            const { dt, main, weather, pop } = hour;
            const { temp } = main;
            const { description, icon } = weather[0];
            return (
              <motion.div
                key={dt}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cardClasses}
                onClick={() => toggleTooltip(dt)}
              >
                {/* Time */}
                <p className="text-lg text-gray-700 dark:text-gray-300 font-poppins drop-shadow-sm">
                  {new Date(dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* Weather Icon */}
                <img
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt={description}
                  className="w-16 h-16 my-2 drop-shadow-md"
                />

                {/* Temperature */}
                <p className="text-2xl font-bold text-blue-600 dark:text-yellow-200 font-poppins drop-shadow-md">
                  {temp.toFixed(1)}°C
                </p>

                {/* Tooltip for Weather Description and Precipitation */}
                <span
                  className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none sm:group-hover:opacity-100 sm:opacity-0 ${
                    showTooltip[dt] ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {description} | Precipitation: {Math.round(pop * 100)}%
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Navigation Arrows */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={`p-2 rounded-full bg-gray-100/90 dark:bg-gray-700/90 ${
            currentPage === 0
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-blue-600 dark:text-yellow-200 hover:bg-gray-200/90 dark:hover:bg-gray-600/90'
          } transition-colors`}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className={`p-2 rounded-full bg-gray-100/90 dark:bg-gray-700/90 ${
            currentPage >= totalPages - 1
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-blue-600 dark:text-yellow-200 hover:bg-gray-200/90 dark:hover:bg-gray-600/90'
          } transition-colors`}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default HourlyTemperature;