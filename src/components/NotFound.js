import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, MapPin } from 'react-feather';

const quickCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi',
];

const NotFound = ({ setLocation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full w-full text-center p-6 max-w-lg mx-auto"
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
        <div className="relative bg-white/10 dark:bg-black/20 p-6 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-md">
          <MapPin size={48} className="text-gray-400 dark:text-white/50" />
          <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
        Location not found
      </h2>

      <p className="text-base text-gray-600 dark:text-blue-100/70 max-w-sm mx-auto mb-6 leading-relaxed">
        We couldn't find that city. Check the spelling or try one of these popular Indian cities:
      </p>

      {setLocation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {quickCities.map(city => (
            <button
              key={city}
              onClick={() => setLocation(city)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 text-slate-700 dark:text-slate-200 text-sm font-semibold border border-white/50 dark:border-white/10 transition-all shadow-soft backdrop-blur-md"
            >
              <MapPin size={12} className="opacity-60" />
              {city}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default NotFound;
