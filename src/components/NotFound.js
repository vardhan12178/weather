import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center  dark:from-black dark:to-black h-90">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg text-center text-white max-w-md w-full rounded-xl"> {/* Added rounded-xl here */}
        <h2 className="text-3xl sm:text-3xl font-semibold mb-4">Location Not Found</h2>
        <p className="text-lg mb-4">Please enter a valid city name.</p>
        <ExclamationCircleIcon className="w-16 h-16 sm:w-16 sm:h-16 text-white mb-6 mx-auto" />
      </div>
    </div>
  );
};

export default NotFound;
