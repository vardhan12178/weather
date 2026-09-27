import { createContext, useContext } from 'react';
import type { Unit } from '../types/weather';

export interface Settings {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  toggleUnit: () => void;
}

export const SettingsContext = createContext<Settings | null>(null);

export const useSettings = (): Settings => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
};
