import React from 'react';
import { MapPin, RefreshCw } from 'react-feather';

const quickCities = ['Mumbai', 'Delhi', 'Bengaluru', 'London', 'New York', 'Tokyo'];

const NotFound = ({ message = 'We could not load this location.', setLocation, onRetry }) => (
  <section className="premium-panel w-full p-7 text-center sm:p-10" aria-labelledby="weather-error-heading">
    <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-950/15 dark:bg-white dark:text-slate-950">
      <MapPin size={25} />
    </div>
    <p className="section-eyebrow mt-6">Weather unavailable</p>
    <h1 id="weather-error-heading" className="mt-2 text-3xl font-black tracking-[-0.045em] text-slate-950 dark:text-white">Let’s find another sky</h1>
    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">{message}</p>

    {onRetry && (
      <button type="button" onClick={onRetry} className="premium-action mx-auto mt-6">
        <RefreshCw size={16} /> Try again
      </button>
    )}

    {setLocation && (
      <div className="mt-8 border-t border-slate-200/70 pt-6 dark:border-white/10">
        <p className="premium-menu-label">Popular places</p>
        <div className="flex flex-wrap justify-center gap-2">
          {quickCities.map((city) => (
            <button key={city} type="button" onClick={() => setLocation(city)} className="rounded-full border border-slate-200/80 bg-white/60 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
              {city}
            </button>
          ))}
        </div>
      </div>
    )}
  </section>
);

export default NotFound;
