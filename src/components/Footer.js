import React from 'react';
import { Heart } from 'react-feather';

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-auto flex flex-col items-center justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity duration-300">
      <div className="flex items-center gap-1.5">
        <span>© 2025 Weatherly</span>
        <span className="text-slate-300 dark:text-slate-600">•</span>
        <span>Made with</span>
        <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" />
        <span>by Bala Vardhan</span>
      </div>
      <div className="text-[9px] opacity-70">
        Powered by OpenWeatherMap
      </div>
    </footer>
  );
};

export default Footer;