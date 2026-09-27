import { Navigation, RefreshCw, Share, Smartphone } from 'lucide-react';
import Sheet from '../../components/Sheet';
import { useSettings } from '../../context/settings';
import type { InstallState } from '../pwa/useInstallPrompt';
import type { Unit } from '../../types/weather';

const UNITS: { value: Unit; label: string; hint: string }[] = [
  { value: 'metric', label: '°C', hint: 'km/h · km' },
  { value: 'imperial', label: '°F', hint: 'mph · mi' },
];

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  updatedLabel: string;
  onLocate: () => void;
  install: InstallState;
}

const SettingsSheet = ({ open, onClose, onRefresh, refreshing, updatedLabel, onLocate, install }: SettingsSheetProps) => {
  const { unit, setUnit } = useSettings();

  return (
    <Sheet open={open} onClose={onClose} title="Settings">
      <div className="flex flex-col gap-6">
        <fieldset>
          <legend className="mb-2 text-footnote font-semibold text-white/85">Units</legend>
          {/* Segmented control built from radio buttons: arrow keys and screen readers work natively */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-surface-raised p-1">
            {UNITS.map((u) => (
              <label
                key={u.value}
                className={`flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-xl transition-colors has-focus-visible:outline-2 has-focus-visible:outline-white ${
                  unit === u.value ? 'bg-brand-500 text-white shadow' : 'text-white/85 hover:bg-white/10'
                }`}
              >
                <input type="radio" name="unit" value={u.value} checked={unit === u.value} onChange={() => setUnit(u.value)} className="sr-only" />
                <span className="text-headline font-semibold">{u.label}</span>
                <span className="text-caption">{u.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="-mx-2 flex flex-col">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="flex min-h-14 items-center gap-3 rounded-2xl px-3 text-left hover:bg-white/5 disabled:opacity-70"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />
            <span className="flex-1">
              <span className="block text-headline font-semibold">{refreshing ? 'Refreshing…' : 'Refresh now'}</span>
              <span className="block text-footnote text-white/85">{updatedLabel}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              onLocate();
              onClose();
            }}
            className="flex min-h-14 items-center gap-3 rounded-2xl px-3 text-left hover:bg-white/5"
          >
            <Navigation size={20} aria-hidden="true" />
            <span className="text-headline font-semibold">Use my current location</span>
          </button>
          {install.canInstall && (
            <button type="button" onClick={install.install} className="flex min-h-14 items-center gap-3 rounded-2xl px-3 text-left hover:bg-white/5">
              <Smartphone size={20} aria-hidden="true" />
              <span>
                <span className="block text-headline font-semibold">Install app</span>
                <span className="block text-footnote text-white/85">Open from your home screen, works offline</span>
              </span>
            </button>
          )}
          {install.showIosHint && (
            <div className="flex min-h-14 items-center gap-3 px-3 py-2">
              <Share size={20} className="shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-headline font-semibold">Install on iPhone or iPad</span>
                <span className="block text-footnote text-white/85">
                  Tap Share in Safari, then Add to Home Screen.
                </span>
              </span>
            </div>
          )}
        </div>

        <p className="text-footnote text-white/85">
          Weather data by{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            Open-Meteo
          </a>{' '}
          (CC BY 4.0). Place names ©{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            OpenStreetMap contributors
          </a>
          .
        </p>
      </div>
    </Sheet>
  );
};

export default SettingsSheet;
