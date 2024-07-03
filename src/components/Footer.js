import React from 'react';

const Footer = () => {
  const text = "© Bala Vardhan @2024";
  
  return (
    <footer className="w-full py-2 mt-5 text-sm bg-gradient-to-r from-blue-800 to-purple-800 dark:from-gray-700 dark:to-gray-600 text-white dark:text-gray-200 text-center shadow-lg">
      {text}
    </footer>
  );
};

export default Footer;
