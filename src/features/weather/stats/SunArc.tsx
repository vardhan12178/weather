import { Sunrise, Sunset } from 'react-feather';
import { formatClock } from '../../../lib/time';
import { useNow } from '../../../lib/useNow';

interface SunArcProps {
  sunrise: number;
  sunset: number;
  timezone: string;
}

const ARC_LENGTH = 251.2; // π × r(80)

/** Sun (or moon) position between today's sunrise and sunset */
const SunArc = ({ sunrise, sunset, timezone }: SunArcProps) => {
  const now = useNow();
  const isDay = now >= sunrise && now <= sunset;
  const progress = isDay ? (now - sunrise) / (sunset - sunrise) : now > sunset ? 1 : 0;
  const clamped = Math.max(0, Math.min(1, progress));

  const angle = ((180 - clamped * 180) * Math.PI) / 180;
  const x = 90 + 80 * Math.cos(angle);
  const y = 90 - 80 * Math.sin(angle);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            <Sunrise size={12} />
            <span>Sunrise</span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 tnum">{formatClock(sunrise, timezone)}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            <span>Sunset</span>
            <Sunset size={12} />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 tnum">{formatClock(sunset, timezone)}</span>
        </div>
      </div>

      <div className="relative h-24 w-full mt-2 flex justify-center items-end overflow-visible select-none">
        <svg className="w-full h-full md:w-2/3 overflow-visible" viewBox="0 0 180 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
          <path d="M 10,90 A 80,80 0 0,1 170,90" fill="none" stroke="currentColor" className="text-slate-950/15 dark:text-white/10" strokeWidth="2" strokeDasharray="4 4" />
          <path
            d="M 10,90 A 80,80 0 0,1 170,90"
            fill="none"
            stroke={isDay ? 'url(#sunArcGrad)' : 'url(#moonArcGrad)'}
            strokeWidth="3.5"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={ARC_LENGTH * (1 - clamped)}
            strokeLinecap="round"
          />
          <g transform={`translate(${x}, ${y})`}>
            {isDay ? (
              <circle r="7.5" fill="url(#sunMarkerColor)" />
            ) : (
              <path d="M -3 3 a 4.5 4.5 0 1 1 3 -7.5 a 5.5 5.5 0 0 0 -3 7.5" fill="url(#moonMarkerColor)" />
            )}
          </g>
          <defs>
            <linearGradient id="sunArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="moonArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <radialGradient id="sunMarkerColor" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="100%" stopColor="#fbbf24" />
            </radialGradient>
            <linearGradient id="moonMarkerColor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="w-full flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-950/5 dark:border-white/5 pt-2">
        <span>Horizon</span>
        <span>{isDay ? 'Daytime' : 'Nighttime'}</span>
        <span>Horizon</span>
      </div>
    </div>
  );
};

export default SunArc;
