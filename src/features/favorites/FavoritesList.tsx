import { Trash2 } from 'react-feather';
import WeatherIcon from '../../components/WeatherIcon';
import { MAX_FAVORITES, type SavedPlace } from './useFavorites';
import { useWeatherSnapshot } from '../weather/queries';
import { formatTemp } from '../../lib/units';
import type { Unit } from '../../types/weather';

interface FavoriteCardProps {
  place: SavedPlace;
  unit: Unit;
  onSelect: (place: SavedPlace) => void;
  onRemove: (place: SavedPlace) => void;
}

const FavoriteCard = ({ place, unit, onSelect, onRemove }: FavoriteCardProps) => {
  // Live conditions (only for places saved with coordinates)
  const { data } = useWeatherSnapshot(place.lat, place.lon);

  return (
    <div className="relative shrink-0 w-36">
      <button
        type="button"
        onClick={() => onSelect(place)}
        className="w-full text-left rounded-xl p-3 bg-white/55 dark:bg-white/10 border border-white/50 dark:border-white/10 hover:bg-white/75 dark:hover:bg-white/20 transition-colors"
      >
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate pr-6">{place.name}</p>
        <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 mt-0.5">{place.country || '—'}</p>
        <div className="h-10 mt-2 flex items-center">{data && <WeatherIcon code={data.icon} size={28} />}</div>
        <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 tnum">{data ? formatTemp(data.temp, unit) : '--°'}</p>
        <p className="text-[10px] text-slate-600 dark:text-slate-300 truncate">{data?.description ?? 'Tap to load'}</p>
      </button>
      <button
        type="button"
        onClick={() => onRemove(place)}
        aria-label={`Remove ${place.name} from saved places`}
        className="absolute top-1 right-1 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-colors"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
};

interface FavoritesListProps {
  favorites: SavedPlace[];
  unit: Unit;
  onSelect: (place: SavedPlace) => void;
  onRemove: (place: SavedPlace) => void;
}

const FavoritesList = ({ favorites, unit, onSelect, onRemove }: FavoritesListProps) => {
  if (favorites.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Saved places</h3>
        <span className="text-[10px] font-semibold text-brand-700 dark:text-brand-200 bg-brand-100/70 dark:bg-brand-900/40 rounded-full px-2 py-0.5">
          {favorites.length}/{MAX_FAVORITES}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {favorites.map((place) => (
          <FavoriteCard key={`${place.name}-${place.lat}-${place.lon}`} place={place} unit={unit} onSelect={onSelect} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
