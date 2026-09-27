import React from 'react';
import { Trash2 } from 'react-feather';
import WeatherIcon from './WeatherIcon';
import { MAX_FAVORITES } from '../hooks/useWeatherData';
import { convertTemp } from '../utils/units';

const FavoritesList = ({ favorites, unit = 'metric', setLocation, removeFromFavorites }) => {
  if (!favorites?.length) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Saved places</h3>
        <span className="text-[10px] font-semibold text-brand-700 dark:text-brand-200 bg-brand-100/70 dark:bg-brand-900/40 rounded-full px-2 py-0.5">
          {favorites.length}/{MAX_FAVORITES}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {favorites.map((city) => (
          <div
            key={city.name}
            role="button"
            tabIndex={0}
            onClick={() => setLocation(city.name)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setLocation(city.name);
              }
            }}
            className="relative flex-shrink-0 w-36 text-left rounded-[20px] p-3 bg-white/55 dark:bg-white/10 border border-white/50 dark:border-white/10 hover:bg-white/75 dark:hover:bg-white/20 transition-colors cursor-pointer"
          >
            <button
              onClick={(event) => {
                event.stopPropagation();
                removeFromFavorites(city.name);
              }}
              aria-label={`Remove ${city.name} from saved places`}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/5 hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 size={10} />
            </button>

            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate pr-4">{city.name}</p>
            <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 mt-0.5">{city.country || '--'}</p>
            <div className="h-10 mt-2 flex items-center">
              <WeatherIcon code={city.icon} size={28} />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 tnum">{city.temp != null ? Math.round(convertTemp(city.temp, city.unit ?? 'metric', unit)) : '--'}&deg;</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 capitalize truncate">{city.desc || 'Conditions unavailable'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
