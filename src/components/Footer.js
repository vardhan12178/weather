import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 flex flex-col items-center justify-center gap-1 text-[10px] text-slate-600 dark:text-slate-300 font-semibold tracking-wider uppercase text-center">
      <div className="flex items-center gap-2">
        <span>&copy; {new Date().getFullYear()} Weatherly</span>
        <span className="opacity-60">|</span>
        <span>Live weather intelligence</span>
      </div>
      {/* Attribution required by Open-Meteo (CC BY 4.0) and OpenStreetMap (ODbL) */}
      <div className="normal-case tracking-normal font-medium opacity-80">
        Weather data by{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-100">
          Open-Meteo.com
        </a>{' '}
        (CC BY 4.0) · Geocoding ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-100">
          OpenStreetMap contributors
        </a>
      </div>
    </footer>
  );
};

export default Footer;
