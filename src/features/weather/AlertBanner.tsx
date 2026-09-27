import { useState } from 'react';
import { CloudRain, Eye, Snowflake, Sun, Thermometer, TriangleAlert, Wind, X, type LucideIcon } from 'lucide-react';
import IconButton from '../../components/IconButton';
import type { AlertKind, AlertTone, WeatherAlert } from './insights/rules';

const ICONS: Record<AlertKind, LucideIcon> = {
  storm: TriangleAlert,
  heat: Thermometer,
  freeze: Snowflake,
  monsoon: CloudRain,
  fog: Eye,
  wind: Wind,
  uv: Sun,
};

// Tinted glass; white text keeps contrast because the tint sits on the dark card base
const TONES: Record<AlertTone, string> = {
  amber: 'bg-amber-500/25 border-amber-300/40',
  red: 'bg-red-500/30 border-red-300/40',
  orange: 'bg-orange-500/25 border-orange-300/40',
  sky: 'bg-sky-500/25 border-sky-300/40',
  blue: 'bg-blue-500/25 border-blue-300/40',
  slate: 'bg-slate-400/20 border-slate-200/30',
  purple: 'bg-purple-500/25 border-purple-300/40',
};

/** Real warnings only. Give it a `key` per place so a dismissal doesn't carry over. */
const AlertBanner = ({ alert }: { alert: WeatherAlert }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const Icon = ICONS[alert.kind];

  return (
    <section role="status" aria-label="Weather alert" className={`glass flex items-start gap-3 py-3 pl-4 pr-1 ${TONES[alert.tone]}`}>
      <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-body font-semibold">{alert.title}</p>
        <p className="mt-0.5 text-footnote text-white/90">{alert.message}</p>
      </div>
      <IconButton label="Dismiss alert" onClick={() => setVisible(false)} className="-mt-1">
        <X size={18} />
      </IconButton>
    </section>
  );
};

export default AlertBanner;
