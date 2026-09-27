import { motion } from 'framer-motion';
import { Droplet } from 'react-feather';
import WeatherIcon from '../../components/WeatherIcon';
import { textPrimary, textSecondary } from '../../components/ui';
import { formatHour } from '../../lib/time';
import { formatTemp } from '../../lib/units';
import type { HourlyForecast as Hour, Unit } from '../../types/weather';

interface HourlyForecastProps {
  hours: Hour[];
  timezone: string;
  unit: Unit;
}

/** Next 24 hours in 1-hour steps; the first slot is the current hour */
const HourlyForecast = ({ hours, timezone, unit }: HourlyForecastProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
    <div className="flex gap-3 w-full overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none">
      {hours.slice(0, 24).map((hour, index) => {
        const isNow = index === 0;
        const cardBg = isNow
          ? 'bg-linear-to-b from-brand-400/20 to-brand-500/10 border-brand-400/50 shadow-soft ring-1 ring-brand-400/20 z-10'
          : 'bg-white/50 dark:bg-slate-900/10 hover:bg-white/70 dark:hover:bg-slate-900/20 border-white/40 dark:border-white/5';

        return (
          <motion.div
            key={hour.time}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
            className={`shrink-0 w-[100px] snap-start p-3.5 rounded-[22px] border backdrop-blur-2xl flex flex-col items-center justify-between transition-all duration-300 ${cardBg}`}
          >
            <span className={`text-[11px] font-bold tracking-tight ${isNow ? 'text-brand-600 dark:text-brand-300' : textPrimary}`}>
              {isNow ? 'Now' : formatHour(hour.time, timezone)}
            </span>

            <div className="relative my-2.5 flex items-center justify-center h-12">
              <WeatherIcon code={hour.icon} className="filter drop-shadow-md select-none" size={36} />
              {hour.pop > 0 && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-brand-600 dark:text-brand-300 bg-brand-500/10 dark:bg-brand-400/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 z-10">
                  <Droplet size={8} className="fill-current text-brand-500" />
                  {Math.round(hour.pop)}%
                </span>
              )}
            </div>

            <div className="text-center mt-1">
              <span className={`text-xl font-semibold tracking-tight tnum ${textPrimary}`}>{formatTemp(hour.temp, unit)}</span>
              <p className={`text-[9px] font-semibold tracking-tight ${textSecondary} mt-0.5`}>
                Feels {formatTemp(hour.feelsLike, unit)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

export default HourlyForecast;
