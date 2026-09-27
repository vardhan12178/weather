import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, type TooltipContentProps } from 'recharts';
import { Droplet } from 'react-feather';
import { formatHour } from '../../../lib/time';
import type { HourlyForecast } from '../../../types/weather';

interface Point {
  time: string;
  rain: number;
}

const axisProps = {
  stroke: '#64748b',
  style: { fontSize: '10px', fontWeight: 'bold' },
  tick: { fill: '#64748b' },
} as const;

const barColor = (value: number) => {
  if (value >= 70) return '#3b82f6';
  if (value >= 40) return '#60a5fa';
  return '#93c5fd';
};

const PrecipitationTooltip = ({ active, payload }: TooltipContentProps<number, string>) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as Point;
  return (
    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg">
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{point.time}</p>
      <div className="flex items-center gap-2">
        <Droplet size={14} className="text-brand-500" />
        <p className="text-sm font-bold text-brand-600 dark:text-brand-300">{point.rain}% chance</p>
      </div>
    </div>
  );
};

const LEGEND = [
  { swatch: 'bg-blue-500', label: 'High (70%+)' },
  { swatch: 'bg-blue-400', label: 'Medium (40–70%)' },
  { swatch: 'bg-blue-300', label: 'Low (<40%)' },
];

const PrecipitationChart = ({ hours, timezone }: { hours: HourlyForecast[]; timezone: string }) => {
  const data: Point[] = hours.slice(0, 24).map((h) => ({
    time: formatHour(h.time, timezone),
    rain: Math.round(h.pop),
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-slate-700 dark:text-white font-bold text-xs mb-4 ml-1 uppercase tracking-wider flex items-center gap-2">
        <Droplet size={14} className="text-brand-500" />
        <span>Precipitation probability</span>
        <div className="h-px bg-slate-700/10 dark:bg-white/20 grow" />
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
          <XAxis dataKey="time" interval={3} {...axisProps} />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} {...axisProps} />
          <Tooltip content={PrecipitationTooltip} />
          <Bar dataKey="rain" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.time} fill={barColor(entry.rain)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        {LEGEND.map(({ swatch, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-xs ${swatch}`} />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrecipitationChart;
