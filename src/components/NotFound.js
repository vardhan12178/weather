import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg p-8 text-center border border-white/10 dark:border-gray-700/20 max-w-md w-full">
        {/* Icon */}
        <ExclamationCircleIcon className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-6" />

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Location Not Found
        </h2>

        {/* Message */}
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Please enter a valid city name.
        </p>
      </div>
    </div>
  );
};

export default NotFound;