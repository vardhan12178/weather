import { Clock, Sunrise, Sunset } from 'lucide-react';
import WeatherIcon from '../../components/WeatherIcon';
import { formatHour, formatInZone } from '../../lib/time';
import { formatTemp } from '../../lib/units';
import type { Unit, WeatherReport } from '../../types/weather';

type StripItem =
  | { kind: 'hour'; time: number; icon: string; pop: number; temp: number; isNow: boolean }
  | { kind: 'sunrise' | 'sunset'; time: number };

/** 24 hourly slots, with sunrise/sunset slotted in where they happen */
const buildStrip = (report: WeatherReport): StripItem[] => {
  const hours = report.hourly.slice(0, 24);
  if (hours.length === 0) return [];
  const start = hours[0].time;
  const end = hours[hours.length - 1].time + 3600;

  const items: StripItem[] = hours.map((h, i) => ({ kind: 'hour', time: h.time, icon: h.icon, pop: h.pop, temp: h.temp, isNow: i === 0 }));
  for (const day of report.daily.slice(0, 2)) {
    if (day.sunrise > start && day.sunrise < end) items.push({ kind: 'sunrise', time: day.sunrise });
    if (day.sunset > start && day.sunset < end) items.push({ kind: 'sunset', time: day.sunset });
  }
  return items.sort((a, b) => a.time - b.time);
};

interface HourlyCardProps {
  report: WeatherReport;
  unit: Unit;
  summary: string;
}

const HourlyCard = ({ report, unit, summary }: HourlyCardProps) => {
  const tz = report.timezone;
  const items = buildStrip(report);

  return (
    <section aria-labelledby="hourly-title" className="glass px-4 pb-2 pt-3">
      <h2 id="hourly-title" className="flex items-center gap-1.5 text-footnote font-semibold text-white/85">
        <Clock size={14} aria-hidden="true" /> Hourly forecast
      </h2>
      <p className="mt-1 text-body">{summary}</p>
      <div className="mt-3 border-t border-white/15" />

      <ol className="hide-scrollbar -mx-2 flex snap-x overflow-x-auto py-2" aria-label="Next 24 hours">
        {items.map((item) =>
          item.kind === 'hour' ? (
            <li key={item.time} className="flex w-14 shrink-0 snap-start flex-col items-center gap-1.5 py-1">
              <span className="text-footnote font-semibold">{item.isNow ? 'Now' : formatHour(item.time, tz)}</span>
              <WeatherIcon code={item.icon} size={28} />
              <span className={`text-caption font-semibold text-sky-200 tnum ${item.pop >= 20 ? '' : 'invisible'}`}>
                {Math.round(item.pop)}%
              </span>
              <span className="text-headline font-semibold">{formatTemp(item.temp, unit)}</span>
            </li>
          ) : (
            <li key={`${item.kind}-${item.time}`} className="flex w-16 shrink-0 snap-start flex-col items-center gap-1.5 py-1">
              <span className="text-footnote font-semibold tnum">{formatInZone(item.time, tz, { hour: 'numeric', minute: '2-digit' })}</span>
              {item.kind === 'sunrise' ? (
                <Sunrise size={28} className="text-amber-300" aria-hidden="true" />
              ) : (
                <Sunset size={28} className="text-orange-300" aria-hidden="true" />
              )}
              <span className="invisible text-caption">–</span>
              <span className="text-footnote font-semibold">{item.kind === 'sunrise' ? 'Sunrise' : 'Sunset'}</span>
            </li>
          ),
        )}
      </ol>
    </section>
  );
};

export default HourlyCard;
