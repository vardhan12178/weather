import { motion } from 'framer-motion';
import WeatherIcon from '../../components/WeatherIcon';
import { sectionTitle, textPrimary, textSecondary } from '../../components/ui';
import { formatShortDate, formatWeekday } from '../../lib/time';
import { formatTemp } from '../../lib/units';
import type { DailyForecast as Day, Unit } from '../../types/weather';

// Colour the range bar by how hot the day gets (°C)
const tempGradient = (maxC: number) => {
  if (maxC >= 38) return 'from-orange-400 to-red-500 shadow-[0_0_4px_rgba(239,68,68,0.25)]';
  if (maxC >= 30) return 'from-yellow-400 via-orange-400 to-orange-500 shadow-[0_0_4px_rgba(245,158,11,0.2)]';
  if (maxC >= 20) return 'from-emerald-400 via-yellow-400 to-amber-400 shadow-[0_0_4px_rgba(52,211,153,0.15)]';
  return 'from-sky-400 to-indigo-500 shadow-[0_0_4px_rgba(56,189,248,0.2)]';
};

interface DailyForecastProps {
  days: Day[];
  currentTemp: number;
  timezone: string;
  unit: Unit;
}

const DailyForecast = ({ days, currentTemp, timezone, unit }: DailyForecastProps) => {
  if (days.length === 0) return null;

  // Scale every day's bar against the whole week's range (all °C)
  const weekMin = Math.min(...days.map((d) => d.tempMin));
  const weekMax = Math.max(...days.map((d) => d.tempMax));
  const range = weekMax - weekMin;
  const pct = (t: number) => (range > 0 ? ((t - weekMin) / range) * 100 : 0);

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className={`${sectionTitle} mb-5`}>{days.length}-Day Forecast</h3>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col w-full gap-2.5">
        {days.map((day, index) => (
          <motion.div
            key={day.time}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center justify-between py-2.5 px-4 rounded-2xl hover:bg-slate-950/5 dark:hover:bg-white/5 transition-all duration-200"
          >
            <div className="w-16 shrink-0">
              <p className={`${textPrimary} text-xs font-bold tracking-tight`}>{index === 0 ? 'Today' : formatWeekday(day.time, timezone)}</p>
              <p className={`${textSecondary} text-[10px] font-semibold mt-0.5`}>{formatShortDate(day.time, timezone)}</p>
            </div>

            <div className="flex flex-col items-center justify-center shrink-0 w-12">
              <WeatherIcon code={day.icon} size={28} />
              {day.pop >= 20 && (
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-300 tnum">{Math.round(day.pop)}%</span>
              )}
            </div>

            <div className="grow flex items-center gap-3 justify-end min-w-0">
              <span className={`${textSecondary} text-[11px] font-bold w-8 text-right shrink-0 tnum`}>{formatTemp(day.tempMin, unit)}</span>

              <div className="relative grow max-w-[130px] sm:max-w-[180px] h-2 bg-slate-950/10 dark:bg-white/10 rounded-full overflow-visible flex items-center">
                <div
                  className={`absolute h-full rounded-full bg-linear-to-r ${tempGradient(day.tempMax)}`}
                  style={{ left: `${pct(day.tempMin)}%`, width: `${range > 0 ? pct(day.tempMax) - pct(day.tempMin) : 100}%` }}
                />
                {index === 0 && currentTemp >= day.tempMin && currentTemp <= day.tempMax && (
                  <div
                    className="absolute w-3.5 h-3.5 bg-white dark:bg-slate-900 border-2 border-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.9)] z-10"
                    style={{ left: `calc(${pct(currentTemp)}% - 7px)` }}
                  />
                )}
              </div>

              <span className={`${textPrimary} text-[11px] font-bold w-8 text-left shrink-0 tnum`}>{formatTemp(day.tempMax, unit)}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DailyForecast;
