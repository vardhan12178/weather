import React from 'react';
import { Clock } from 'react-feather';

const RecentSearches = ({ searches, onSearch }) => {
  if (!searches?.length) return null;
  return (
    <div className="grid gap-1">
      {searches.map((search) => (
        <button key={search} type="button" onClick={() => onSearch(search)} className="premium-location-option">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950/5 text-slate-500 dark:bg-white/10 dark:text-slate-300"><Clock size={14} /></span>
          <span className="truncate text-sm font-semibold">{search}</span>
        </button>
      ))}
    </div>
  );
};

export default RecentSearches;
