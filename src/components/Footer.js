import React from 'react';

const Footer = () => {
  return (
    <footer className="flex w-full flex-col items-center justify-center gap-1 py-8 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
      <div className="flex items-center gap-2">
        <span>&copy; 2026 Weatherly</span>
        <span className="opacity-60">|</span>
        <span>Live weather intelligence</span>
      </div>
      <div className="text-[9px] opacity-75">Weather data by Open-Meteo · Maps data by OpenStreetMap</div>
    </footer>
  );
};

export default Footer;
