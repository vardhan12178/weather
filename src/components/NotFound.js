import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Search } from 'react-feather';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full w-full text-center p-6"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
        <div className="relative bg-white/10 dark:bg-black/20 p-6 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-md">
           <Search size={48} className="text-gray-400 dark:text-white/50" />
           <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg">
             <AlertCircle size={20} />
           </div>
        </div>
      </div>

      <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2 drop-shadow-sm">
        Location Not Found
      </h2>
      
      <p className="text-lg text-gray-600 dark:text-blue-100/70 max-w-md mx-auto">
        We couldn't find the city you're looking for. Please check the spelling or try a different location.
      </p>
    </motion.div>
  );
};

export default NotFound;