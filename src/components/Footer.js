import React from 'react';
import { Heart } from 'react-feather';

const Footer = () => {
  return (
    <footer className="w-full py-6 text-center z-50 flex justify-center">
      {/* Glass Pill Container */}
      <div className="inline-flex items-center justify-center space-x-3 px-4 py-2 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm">
        
        <span className="text-[10px] uppercase tracking-widest text-gray-800 dark:text-white/40 font-bold">
          © 2025 Weatherly
        </span>
        
        <span className="text-gray-400 dark:text-white/20">•</span>
        
        <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-800 dark:text-white/40 font-bold">
          Made with <Heart size={10} className="text-red-500 fill-current" /> by Bala Vardhan
        </span>
        
        <span className="text-gray-400 dark:text-white/20">•</span>
        
        <span className="text-[10px] uppercase tracking-widest text-gray-800 dark:text-white/40 font-bold">
          OpenWeatherMap
        </span>

      </div>
    </footer>
  );
};

export default Footer;