// src/components/NotFound.js
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { WiCloud } from 'react-icons/wi'; // Using a weather-related icon
import { X } from 'react-feather'; // For the close button

const NotFound = ({ onRetry, onDismiss }) => {
  const searchInputRef = useRef(null); // Ref to focus the search input (if passed from parent)

  const handleRetry = () => {
    if (onRetry && searchInputRef.current) {
      searchInputRef.current.focus(); // Focus the search input
      onRetry(); // Callback to retry the search (e.g., clear the error state)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-[200px]"
    >
      <div className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md rounded-xl shadow-lg p-8 text-center border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full relative">
        {/* Close Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Dismiss error message"
          >
            <X size={20} />
          </button>
        )}

        {/* Icon with Subtle Animation */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, yoyo: Infinity }}
        >
          <WiCloud className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-6" />
        </motion.div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 font-poppins drop-shadow-sm">
          Oops! Location Not Found
        </h2>

        {/* Message */}
        <p className="text-lg text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm mb-6">
          We couldn’t find that location. Try checking your spelling or searching for a nearby city.
        </p>

        {/* Suggested Cities */}
        <p className="text-sm text-gray-600 dark:text-gray-300 font-poppins drop-shadow-sm mb-6">
          Try searching for: <span className="text-blue-600 dark:text-blue-400">London</span>,{' '}
          <span className="text-blue-600 dark:text-blue-400">New York</span>, or{' '}
          <span className="text-blue-600 dark:text-blue-400">Tokyo</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-transform duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'} // Redirect to home page
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-transform duration-300 transform hover:scale-105"
          >
            Return to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Optional: Add a ref prop to focus the search input
NotFound.defaultProps = {
  onRetry: null,
  onDismiss: null,
};

export default NotFound;