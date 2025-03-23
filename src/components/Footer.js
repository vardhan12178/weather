// src/components/Footer.js
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Dynamically set the year

  return (
    <footer className="w-full py-4 mt-8 bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row gap-4">
          {/* Copyright Notice */}
          <p className="text-center text-sm text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm transition-all duration-300">
            ©{' '}
            <a
              href="https://github.com/bala-vardhan" // Replace with your portfolio or GitHub link
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-yellow-200"
            >
              Bala Vardhan
            </a>{' '}
            {currentYear}
          </p>

            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-800 dark:text-gray-200 font-poppins drop-shadow-sm hover:text-blue-600 dark:hover:text-yellow-200 transition-all duration-300"
            >
              Powered by OpenWeatherMap
            </a>
          </div>
        </div>
    </footer>
  );
};

export default Footer;