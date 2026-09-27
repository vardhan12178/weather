import type { ReactNode } from 'react';
import type { Icon } from 'react-feather';

interface MetricWidgetProps {
  icon: Icon;
  title: string;
  description?: string;
  children: ReactNode;
}

const MetricWidget = ({ icon: IconComponent, title, description, children }: MetricWidgetProps) => (
  <div className="flex flex-col justify-between min-h-[125px] p-3.5 sm:p-4 rounded-[20px] hover:bg-slate-950/[0.04] dark:hover:bg-white/5 transition-all duration-300">
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      <IconComponent size={12} className="opacity-70" />
      <span>{title}</span>
    </div>

    <div className="my-2 grow flex flex-col justify-center">{children}</div>

    {description && <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-normal">{description}</p>}
  </div>
);

/** Big number with a small unit label */
export const MetricValue = ({ value, unit }: { value: ReactNode; unit?: string }) => (
  <div className="flex items-baseline">
    <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white tnum">{value}</span>
    {unit && <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-0.5">{unit}</span>}
  </div>
);

/** Thin track with a marker at `pct` (0–100) and optional fill */
export const MetricTrack = ({
  pct,
  fill,
  trackClass = 'bg-slate-950/10 dark:bg-white/10',
  markerClass = 'border-brand-500',
}: {
  pct: number;
  fill?: string;
  trackClass?: string;
  markerClass?: string;
}) => {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className={`relative w-full h-1.5 rounded-full mt-1.5 ${trackClass}`}>
      {fill && <div className={`absolute h-full rounded-full ${fill}`} style={{ width: `${clamped}%` }} />}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-10 ${markerClass}`}
        style={{ left: `calc(${clamped}% - 6px)` }}
      />
    </div>
  );
};

export default MetricWidget;
