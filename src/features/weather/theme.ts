import { AQI_LEVELS } from './metrics';
import type { AqiLevel, Condition } from '../../types/weather';

// Sky colours per condition × day/night. White text must clear WCAG 4.5:1
// on every one (checked for primary and 85%-white secondary text, both on the
// sky and on the tinted glass cards) — re-check contrast if you change these.
export type Sky =
  | 'clear-day' | 'clear-night'
  | 'clouds-day' | 'clouds-night'
  | 'rain-day' | 'rain-night'
  | 'storm-day' | 'storm-night'
  | 'snow-day' | 'snow-night'
  | 'fog-day' | 'fog-night';

export const SKIES: Record<Sky, { top: string; bottom: string }> = {
  'clear-day': { top: '#1a5bbd', bottom: '#3f86d6' },
  'clear-night': { top: '#070b1f', bottom: '#1a2250' },
  'clouds-day': { top: '#40597a', bottom: '#6a84a2' },
  'clouds-night': { top: '#131a28', bottom: '#2a3548' },
  'rain-day': { top: '#344a63', bottom: '#5b7390' },
  'rain-night': { top: '#0e1420', bottom: '#222d40' },
  'storm-day': { top: '#262b45', bottom: '#474e70' },
  'storm-night': { top: '#0c0e1c', bottom: '#23273f' },
  'snow-day': { top: '#4a6890', bottom: '#7690b2' },
  'snow-night': { top: '#1a2336', bottom: '#34425c' },
  'fog-day': { top: '#515e6f', bottom: '#78879a' },
  'fog-night': { top: '#191e27', bottom: '#353c48' },
};

/** Shown before any weather has loaded */
export const DEFAULT_SKY: Sky = 'clear-day';

const GROUP: Record<Condition, string> = {
  Clear: 'clear',
  Clouds: 'clouds',
  Fog: 'fog',
  Drizzle: 'rain',
  Rain: 'rain',
  Snow: 'snow',
  Thunderstorm: 'storm',
};

export const skyFor = (condition: Condition, isDay: boolean): Sky =>
  `${GROUP[condition]}-${isDay ? 'day' : 'night'}` as Sky;

/** Which animated layer the backdrop draws */
export type Atmosphere = 'sun' | 'stars' | 'clouds' | 'rain' | 'storm' | 'snow' | 'fog';

export const atmosphereFor = (condition: Condition, isDay: boolean, cloudCover = 0): Atmosphere[] => {
  switch (condition) {
    case 'Clear':
      return isDay ? ['sun'] : ['stars'];
    case 'Clouds':
      return cloudCover < 70 ? [isDay ? 'sun' : 'stars', 'clouds'] : ['clouds'];
    case 'Drizzle':
    case 'Rain':
      return ['clouds', 'rain'];
    case 'Thunderstorm':
      return ['clouds', 'rain', 'storm'];
    case 'Snow':
      return ['clouds', 'snow'];
    case 'Fog':
      return ['fog'];
  }
};

// Temperature → colour for the range bars (°C stops, cold blue → hot red)
const STOPS: [number, [number, number, number]][] = [
  [-10, [91, 141, 239]],
  [5, [90, 200, 232]],
  [15, [111, 211, 155]],
  [22, [244, 211, 94]],
  [30, [245, 165, 74]],
  [38, [239, 91, 75]],
];

export const tempColor = (c: number): string => {
  if (c <= STOPS[0][0]) return `rgb(${STOPS[0][1].join(' ')})`;
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    const [t0, c0] = STOPS[i - 1];
    if (c <= t1) {
      const f = (c - t0) / (t1 - t0);
      return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * f)).join(' ')})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1][1].join(' ')})`;
};

/** Meter tracks for the UV and air-quality tiles */
export const UV_GRADIENT = 'linear-gradient(to right, #4ade80, #facc15 30%, #fb923c 55%, #f87171 80%, #c084fc)';

export const aqiGradient = () =>
  `linear-gradient(to right, ${([1, 2, 3, 4, 5] as AqiLevel[]).map((l) => AQI_LEVELS[l].color).join(', ')})`;
