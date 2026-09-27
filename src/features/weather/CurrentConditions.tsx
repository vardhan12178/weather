import { motion } from 'framer-motion';
import { RefreshCw, Star } from 'react-feather';
import WeatherIcon from '../../components/WeatherIcon';
import { iconButton } from '../../components/ui';
import { formatClock, formatLongDate } from '../../lib/time';
import { useNow } from '../../lib/useNow';
import { formatTemp } from '../../lib/units';
import type { Place, Unit, WeatherReport } from '../../types/weather';

interface CurrentConditionsProps {
  report: WeatherReport;
  place: Place;
  unit: Unit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  isFavorite: boolean;
  canAddFavorite: boolean;
  onToggleFavorite: () => void;
}

const CurrentConditions = ({
  report,
  place,
  unit,
  onToggleUnit,
  onRefresh,
  refreshing,
  isFavorite,
  canAddFavorite,
  onToggleFavorite,
}: CurrentConditionsProps) => {
  const { current, timezone } = report;
  const nowSeconds = useNow();

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
      {/* Place, date and actions */}
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-500 dark:text-sky-300/80">
            {formatLongDate(current.time, timezone)}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5 wrap-break-word">
            {place.name ?? 'My location'}
            {place.country && (
              <span className="inline-block whitespace-nowrap text-lg font-bold text-slate-400 dark:text-slate-500 ml-1.5">
                {place.country}
              </span>
            )}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span>Local time {formatClock(nowSeconds, timezone)}</span>
            <span className="text-slate-300 dark:text-slate-700/60 font-black">•</span>
            <span>
              Lat {report.lat.toFixed(2)} | Lon {report.lon.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleUnit}
            className={`${iconButton} text-xs font-black`}
            title={unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
            aria-label={unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
          >
            °{unit === 'metric' ? 'F' : 'C'}
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className={iconButton}
            title="Refresh weather"
            aria-label="Refresh weather"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={onToggleFavorite}
            disabled={!isFavorite && !canAddFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={
              isFavorite
                ? 'w-9 h-9 rounded-full flex items-center justify-center transition-all border active:scale-95 bg-amber-400 border-amber-400 text-slate-950 shadow-md shadow-amber-400/20 hover:bg-amber-300'
                : iconButton
            }
          >
            <Star size={13} className={isFavorite ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* Temperature and condition */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-8">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-500/15 dark:bg-sky-400/10 blur-3xl rounded-full" />
            <WeatherIcon code={current.icon} className="relative w-28 h-28 sm:w-36 sm:h-36 drop-shadow-md select-none" size={144} />
          </div>

          <div className="leading-none">
            <div className="flex items-start">
              <span className="text-7xl sm:text-8xl font-black tracking-tighter text-slate-900 dark:text-white select-none tnum">
                {formatTemp(current.temp, unit).replace('°', '')}
              </span>
              <span className="text-4xl sm:text-5xl font-light text-slate-400 dark:text-sky-300/60 mt-1 select-none">°</span>
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-2.5 tracking-tight">{current.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full sm:w-auto min-w-[240px]">
          <div className="rounded-2xl bg-slate-950/5 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 p-4 flex flex-col justify-between shadow-xs">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Feels like</span>
            <span className="text-xl font-black text-slate-900 dark:text-white mt-1.5 tnum">{formatTemp(current.feelsLike, unit)}</span>
          </div>
          <div className="rounded-2xl bg-slate-950/5 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 p-4 flex flex-col justify-between shadow-xs">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">High / Low</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1.5 tnum">
              {formatTemp(current.tempMax, unit)} <span className="text-slate-400 dark:text-slate-500 font-medium">/</span>{' '}
              {formatTemp(current.tempMin, unit)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentConditions;
