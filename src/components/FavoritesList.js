import React from 'react';
import { Trash2 } from 'react-feather';

const FavoritesList = ({ favorites, setLocation, removeFromFavorites }) => {
  if (!favorites?.length) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em]">Saved places</h3>
        <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-900/40 rounded-full px-2 py-0.5">
          {favorites.length}/5
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {favorites.map((city) => (
          <div
            key={city.name}
            onClick={() => setLocation(city.name)}
            className="relative flex-shrink-0 w-36 text-left rounded-2xl p-3 bg-white/45 dark:bg-white/10 border border-white/20 hover:bg-white/65 dark:hover:bg-white/20 transition-colors cursor-pointer"
          >
            <button
              onClick={(event) => {
                event.stopPropagation();
                removeFromFavorites(city.name);
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/5 hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 size={10} />
            </button>

            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate pr-4">{city.name}</p>
            <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 mt-0.5">{city.country || '--'}</p>
            <img src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`} alt={city.desc || city.name} className="w-10 h-10 mt-2" />
            <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{city.temp ? Math.round(city.temp) : '--'}&deg;</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 capitalize truncate">{city.desc || 'Conditions unavailable'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
