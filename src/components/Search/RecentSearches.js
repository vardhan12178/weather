import React from 'react';
import { Clock } from 'react-feather';

const RecentSearches = ({ searches, onSearch }) => {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="mt-4 w-full animate-in fade-in slide-in-from-top-2">
      <h3 className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3 px-1">
        Recently viewed
      </h3>

      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearch(search)}
            className="group flex items-center gap-2 px-4 py-2 rounded-full
                       bg-slate-200/80 dark:bg-white/10
                       border border-transparent dark:border-white/10
                       text-slate-700 dark:text-gray-200
                       hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600
                       transition-all duration-200"
          >
            <Clock 
              size={12} 
              // FIXED: Changed to text-gray-600 for better contrast in Light Mode
              className="text-gray-600 dark:text-white/60 group-hover:text-white transition-colors" 
            />
            <span className="text-sm font-medium">
              {search}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;