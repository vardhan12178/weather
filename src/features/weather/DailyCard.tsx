import { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import WeatherIcon from '../../components/WeatherIcon';
import { formatClock, formatWeekday } from '../../lib/time';
import { formatTemp } from '../../lib/units';
import { uvLevel } from './metrics';
import { tempColor } from './theme';
import type { DailyForecast, Unit } from '../../types/weather';

interface DailyCardProps {
  days: DailyForecast[];
  currentTemp: number;
  timezone: string;
  unit: Unit;
}

/** 7-day list with Apple-style range bars; tap a day for its details */
const DailyCard = ({ days, currentTemp, timezone, unit }: DailyCardProps) => {
  const [open, setOpen] = useState<number | null>(null);
  if (days.length === 0) return null;

  const weekMin = Math.min(...days.map((d) => d.tempMin));
  const weekMax = Math.max(...days.map((d) => d.tempMax));
  const span = Math.max(weekMax - weekMin, 1);
  const pct = (t: number) => ((t - weekMin) / span) * 100;

  return (
    <section aria-labelledby="daily-title" className="glass px-4 pb-1 pt-3">
      <h2 id="daily-title" className="flex items-center gap-1.5 text-footnote font-semibold text-white/85">
        <CalendarDays size={14} aria-hidden="true" /> {days.length}-day forecast
      </h2>

      <ul className="mt-2">
        {days.map((day, i) => {
          const expanded = open === i;
          return (
            <li key={day.time} className="border-t border-white/15">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : i)}
                className="grid min-h-14 w-full grid-cols-[3.25rem_2.25rem_2.25rem_1fr_2.25rem_1rem] items-center gap-2 text-left"
              >
                <span className="text-headline font-semibold">{i === 0 ? 'Today' : formatWeekday(day.time, timezone)}</span>
                <span className="flex flex-col items-center">
                  <WeatherIcon code={day.icon} size={26} />
                  {day.pop >= 20 && <span className="text-caption font-semibold text-sky-200 tnum">{Math.round(day.pop)}%</span>}
                </span>
                <span className="text-right text-headline text-white/85 tnum">{formatTemp(day.tempMin, unit)}</span>
                <span className="relative h-1.5 rounded-full bg-white/20" aria-hidden="true">
                  <span
                    className="absolute inset-y-0 rounded-full"
                    style={{
                      left: `${pct(day.tempMin)}%`,
                      width: `${Math.max(pct(day.tempMax) - pct(day.tempMin), 4)}%`,
                      background: `linear-gradient(to right, ${tempColor(day.tempMin)}, ${tempColor(day.tempMax)})`,
                    }}
                  />
                  {i === 0 && currentTemp >= day.tempMin && currentTemp <= day.tempMax && (
                    <span
                      className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-black/30"
                      style={{ left: `${pct(currentTemp)}%` }}
                    />
                  )}
                </span>
                <span className="text-headline font-semibold tnum">{formatTemp(day.tempMax, unit)}</span>
                <ChevronDown size={16} className={`text-white/70 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {expanded && (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 pb-4 pt-1 text-footnote animate-fade-in sm:grid-cols-4">
                  <div>
                    <dt className="text-white/85">Conditions</dt>
                    <dd className="font-semibold">{day.description}</dd>
                  </div>
                  <div>
                    <dt className="text-white/85">Chance of rain</dt>
                    <dd className="font-semibold tnum">{Math.round(day.pop)}%</dd>
                  </div>
                  <div>
                    <dt className="text-white/85">UV index</dt>
                    <dd className="font-semibold">
                      {Math.round(day.uvIndexMax)} · {uvLevel(day.uvIndexMax).label}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/85">Sunrise · Sunset</dt>
                    <dd className="font-semibold tnum">
                      {formatClock(day.sunrise, timezone)} · {formatClock(day.sunset, timezone)}
                    </dd>
                  </div>
                </dl>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default DailyCard;
