import type { Unit } from '../types/weather';

// Data is always metric (°C, m/s, metres). These helpers convert for display:
// metric users see °C, km/h and km; imperial users see °F, mph and miles.

export const cToF = (c: number) => (c * 9) / 5 + 32;

export const convertTemp = (celsius: number, unit: Unit) =>
  unit === 'imperial' ? cToF(celsius) : celsius;

/** Rounded temperature with a degree sign, e.g. "24°" */
export const formatTemp = (celsius: number, unit: Unit) =>
  `${Math.round(convertTemp(celsius, unit))}°`;

export const tempUnitLabel = (unit: Unit) => (unit === 'imperial' ? '°F' : '°C');

export const convertWind = (metersPerSecond: number, unit: Unit) =>
  unit === 'imperial' ? metersPerSecond * 2.236936 : metersPerSecond * 3.6;

export const windUnitLabel = (unit: Unit) => (unit === 'imperial' ? 'mph' : 'km/h');

export const formatWind = (metersPerSecond: number, unit: Unit) =>
  `${Math.round(convertWind(metersPerSecond, unit))} ${windUnitLabel(unit)}`;

export const convertDistance = (meters: number, unit: Unit) =>
  unit === 'imperial' ? meters / 1609.344 : meters / 1000;

export const distanceUnitLabel = (unit: Unit) => (unit === 'imperial' ? 'mi' : 'km');

/** Dew point in °C (Magnus formula) */
export const dewPoint = (tempC: number, humidity: number) => {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(Math.max(humidity, 1) / 100);
  return (b * alpha) / (a - alpha);
};

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

export const compassDirection = (deg: number) => COMPASS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
