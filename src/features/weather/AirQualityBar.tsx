import type { AirQuality, AqiLevel } from '../../types/weather';

const LEVELS: Record<AqiLevel, { label: string; dot: string; text: string; theme: string }> = {
  1: {
    label: 'Good', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400',
    theme: 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-800 dark:text-emerald-300',
  },
  2: {
    label: 'Fair', dot: 'bg-green-500', text: 'text-green-600 dark:text-green-400',
    theme: 'from-green-500/10 via-green-500/5 to-transparent border-green-500/20 text-green-800 dark:text-green-300',
  },
  3: {
    label: 'Moderate', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400',
    theme: 'from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20 text-amber-800 dark:text-amber-300',
  },
  4: {
    label: 'Poor', dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400',
    theme: 'from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/20 text-orange-800 dark:text-orange-300',
  },
  5: {
    label: 'Very poor', dot: 'bg-red-600', text: 'text-red-600 dark:text-red-400',
    theme: 'from-red-500/10 via-red-500/5 to-transparent border-red-500/20 text-red-800 dark:text-red-300',
  },
};

const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM₂.₅' },
  { key: 'pm10', label: 'PM₁₀' },
  { key: 'no2', label: 'NO₂' },
  { key: 'o3', label: 'O₃' },
] as const;

const AirQualityBar = ({ airQuality }: { airQuality: AirQuality }) => {
  const level = LEVELS[airQuality.level];

  return (
    <div
      className={`w-full p-4 rounded-2xl bg-linear-to-r ${level.theme} border backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-soft`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-2.5 h-2.5 rounded-full ${level.dot} shadow-xs`} />
        <span className="text-xs font-bold">
          Air quality is <span className={level.text}>{level.label}</span> (European AQI {Math.round(airQuality.europeanAqi)})
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto py-0.5 hide-scrollbar">
        {POLLUTANTS.map(({ key, label }) => {
          const value = airQuality[key];
          return value == null ? null : (
            <div
              key={key}
              className="flex items-center gap-1 bg-white/40 dark:bg-white/10 rounded-full px-2.5 py-0.5 border border-slate-950/10 dark:border-white/10"
            >
              <span className="text-[9px] opacity-60 font-bold">{label}</span>
              <span className="text-xs font-extrabold tnum">{value.toFixed(0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AirQualityBar;
