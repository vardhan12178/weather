import React from 'react';
import { Trash2 } from 'react-feather';
import WeatherIcon from './WeatherIcon';

const FavoritesList = ({ favorites, setLocation, removeFromFavorites }) => {
  if (!favorites?.length) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="section-eyebrow">Your weather</p>
          <h2 className="mt-1 text-sm font-extrabold text-slate-800 dark:text-slate-100">Saved places</h2>
        </div>
        <span className="rounded-full bg-white/50 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">{favorites.length}/6</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {favorites.map((city) => (
          <div key={`${city.name}-${city.country || ''}`} className="relative w-40 shrink-0 overflow-hidden rounded-3xl border border-white/60 bg-white/45 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/65 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
            <button type="button" onClick={() => setLocation([city.name, city.country].filter(Boolean).join(', '))} className="w-full p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500" aria-label={`Show weather for ${city.name}${city.country ? `, ${city.country}` : ''}`}>
              <p className="truncate pr-7 text-sm font-extrabold text-slate-900 dark:text-white">{city.name}</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{city.country || 'Saved place'}</p>
              <div className="mt-3 flex items-end justify-between">
                <WeatherIcon code={city.icon} size={34} />
                <span className="tnum text-2xl font-black tracking-[-0.05em] text-slate-950 dark:text-white">{city.temp != null ? Math.round(city.temp) : '--'}°</span>
              </div>
              <p className="mt-2 truncate text-[11px] font-semibold capitalize text-slate-500 dark:text-slate-300">{city.desc || 'Conditions unavailable'}</p>
            </button>
            <button type="button" onClick={() => removeFromFavorites(city.name)} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-rose-500 hover:text-white" aria-label={`Remove ${city.name} from saved places`}><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
