import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 flex flex-col items-center justify-center gap-1 text-[10px] text-slate-600 dark:text-slate-300 font-semibold tracking-wider uppercase">
      <div className="flex items-center gap-2">
        <span>&copy; 2026 Weatherly</span>
        <span className="opacity-60">|</span>
        <span>Live weather intelligence</span>
      </div>
      <div className="text-[9px] opacity-75">Powered by OpenWeatherMap</div>
    </footer>
  );
};

export default Footer;
