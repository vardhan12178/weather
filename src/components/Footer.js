import React from 'react';

const Footer = () => {
  const text = "© Bala Vardhan @2024";

  return (
    <footer className="w-full py-4 mt-8 bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border-t border-white/10 dark:border-gray-700/20 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 transition-all duration-300 hover:text-blue-600 dark:hover:text-yellow-200">
          {text}
        </p>
      </div>
    </footer>
  );
};

export default Footer;