import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Thermometer, Wind, CloudRain, Eye, Sun, X, type Icon } from 'react-feather';
import type { AlertKind, AlertTone, WeatherAlert } from './rules';

const ICONS: Record<AlertKind, Icon> = {
  storm: AlertTriangle,
  heat: Thermometer,
  freeze: Thermometer,
  monsoon: CloudRain,
  rain: CloudRain,
  fog: Eye,
  wind: Wind,
  uv: Sun,
};

const TONES: Record<AlertTone, string> = {
  amber: 'bg-amber-100/85 dark:bg-amber-900/35 text-amber-900 dark:text-amber-100 border-amber-400/70',
  red: 'bg-red-100/85 dark:bg-red-900/35 text-red-900 dark:text-red-100 border-red-400/70',
  orange: 'bg-orange-100/85 dark:bg-orange-900/35 text-orange-900 dark:text-orange-100 border-orange-400/70',
  sky: 'bg-sky-100/85 dark:bg-sky-900/35 text-sky-900 dark:text-sky-100 border-sky-400/70',
  blue: 'bg-blue-100/85 dark:bg-blue-900/35 text-blue-900 dark:text-blue-100 border-blue-400/70',
  slate: 'bg-slate-100/85 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 border-slate-400/70',
  purple: 'bg-purple-100/85 dark:bg-purple-900/35 text-purple-900 dark:text-purple-100 border-purple-400/70',
};

/** Dismissible banner. Give it a `key` per place so a dismissal doesn't carry over. */
const WeatherAlerts = ({ alert }: { alert: WeatherAlert }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const AlertIcon = ICONS[alert.kind];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      className={`w-full rounded-2xl border px-4 py-3 flex items-start justify-between gap-4 ${TONES[alert.tone]}`}
    >
      <div className="flex items-start gap-3">
        <AlertIcon size={16} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">{alert.title}</p>
          <p className="text-sm font-medium mt-0.5 leading-snug">{alert.message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="-m-2 p-2 opacity-60 hover:opacity-100 transition-opacity shrink-0"
        aria-label="Dismiss alert"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default WeatherAlerts;
