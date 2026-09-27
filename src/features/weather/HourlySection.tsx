import { lazy, Suspense, useState } from 'react';
import { List, BarChart2 } from 'react-feather';
import HourlyForecast from './HourlyForecast';
import { sectionTitle } from '../../components/ui';
import type { HourlyForecast as Hour, Unit } from '../../types/weather';

const ForecastCharts = lazy(() => import('./charts/ForecastCharts'));

const toggleClass = (active: boolean) =>
  `p-2 rounded-full transition-all duration-300 ${
    active
      ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-300 shadow-md scale-105'
      : 'text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-300'
  }`;

interface HourlySectionProps {
  hours: Hour[];
  timezone: string;
  unit: Unit;
}

const HourlySection = ({ hours, timezone, unit }: HourlySectionProps) => {
  const [view, setView] = useState<'list' | 'chart'>('list');

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className={sectionTitle}>Next 24 Hours</h3>
        <div className="flex gap-1 bg-black/5 dark:bg-white/10 rounded-full p-1 border border-slate-950/5 dark:border-white/5 shadow-xs">
          <button type="button" onClick={() => setView('list')} className={toggleClass(view === 'list')} title="List view" aria-label="List view" aria-pressed={view === 'list'}>
            <List size={14} />
          </button>
          <button type="button" onClick={() => setView('chart')} className={toggleClass(view === 'chart')} title="Chart view" aria-label="Chart view" aria-pressed={view === 'chart'}>
            <BarChart2 size={14} />
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <HourlyForecast hours={hours} timezone={timezone} unit={unit} />
      ) : (
        <Suspense fallback={<div className="h-[250px] rounded-2xl bg-slate-950/5 dark:bg-white/5 animate-pulse" />}>
          <ForecastCharts hours={hours} timezone={timezone} unit={unit} />
        </Suspense>
      )}
    </div>
  );
};

export default HourlySection;
