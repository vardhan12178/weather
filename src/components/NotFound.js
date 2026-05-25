import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'react-feather';

const quickCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];

const NotFound = ({ setLocation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto px-6 py-10"
    >
      {/* Single, calm icon — no alarming red glow */}
      <div className="grid place-items-center w-16 h-16 rounded-3xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 shadow-soft mb-6">
        <MapPin size={26} className="text-slate-400 dark:text-slate-300" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Location not found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-300/80 mt-2 leading-relaxed">
        Check the spelling or try another city.
      </p>

      {setLocation && (
        <div className="mt-7 w-full">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Popular cities
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickCities.map((city) => (
              <button
                key={city}
                onClick={() => setLocation(city)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 dark:bg-white/10 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 text-slate-700 dark:text-slate-200 text-sm font-medium border border-white/60 dark:border-white/10 shadow-soft transition-all active:scale-95"
              >
                <MapPin size={13} className="opacity-60" />
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NotFound;
