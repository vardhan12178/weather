import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatHour } from '../../../lib/time';
import { convertTemp, tempUnitLabel } from '../../../lib/units';
import type { HourlyForecast, Unit } from '../../../types/weather';

interface Point {
  time: string;
  temp: number;
  feelsLike: number;
}

const axisProps = {
  stroke: '#64748b',
  style: { fontSize: '10px', fontWeight: 'bold' },
  tick: { fill: '#64748b' },
} as const;

interface TooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
  unitLabel: string;
}

const TemperatureTooltip = ({ active, payload, unitLabel }: TooltipProps) => {
  const point = payload?.[0]?.payload as Point | undefined;
  if (!active || !point) return null;
  return (
    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg">
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{point.time}</p>
      <p className="text-sm font-bold text-brand-600 dark:text-brand-300">
        Temp: {point.temp}
        {unitLabel}
      </p>
      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
        Feels: {point.feelsLike}
        {unitLabel}
      </p>
    </div>
  );
};

interface TemperatureChartProps {
  hours: HourlyForecast[];
  timezone: string;
  unit: Unit;
}

const TemperatureChart = ({ hours, timezone, unit }: TemperatureChartProps) => {
  const data: Point[] = hours.slice(0, 24).map((h) => ({
    time: formatHour(h.time, timezone),
    temp: Math.round(convertTemp(h.temp, unit)),
    feelsLike: Math.round(convertTemp(h.feelsLike, unit)),
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-slate-700 dark:text-white font-bold text-xs mb-4 ml-1 uppercase tracking-wider flex items-center gap-2">
        <span>24-hour temperature trend</span>
        <div className="h-px bg-slate-700/10 dark:bg-white/20 grow" />
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2f6bed" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2f6bed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
          <XAxis dataKey="time" interval={3} {...axisProps} />
          <YAxis domain={['dataMin - 2', 'dataMax + 2']} {...axisProps} />
          <Tooltip content={({ active, payload }) => <TemperatureTooltip active={active} payload={payload} unitLabel={tempUnitLabel(unit)} />} />
          <Area type="monotone" dataKey="temp" stroke="#2f6bed" strokeWidth={3} fill="url(#tempGradient)" dot={false} activeDot={{ r: 6, fill: '#2f6bed' }} />
          <Area type="monotone" dataKey="feelsLike" stroke="#c084fc" strokeWidth={2} strokeDasharray="5 5" fill="url(#feelsGradient)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-brand-500" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-purple-400" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">Feels like</span>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;
