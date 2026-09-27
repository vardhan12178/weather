import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { SettingsContext } from './settings';
import { readJson, STORAGE_KEYS, writeJson } from '../lib/storage';
import type { Unit } from '../types/weather';

// Default to °F where that's the local convention (US, Liberia), °C elsewhere
const defaultUnit = (): Unit => (/-(US|LR)$/i.test(navigator.language) ? 'imperial' : 'metric');

const loadUnit = (): Unit => {
  const saved = readJson<unknown>(STORAGE_KEYS.unit, null);
  return saved === 'metric' || saved === 'imperial' ? saved : defaultUnit();
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnitState] = useState<Unit>(loadUnit);

  const setUnit = useCallback((next: Unit) => {
    setUnitState(next);
    writeJson(STORAGE_KEYS.unit, next);
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  }, [setUnit, unit]);

  const value = useMemo(() => ({ unit, setUnit, toggleUnit }), [unit, setUnit, toggleUnit]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
