import { getRecommendation, type InsightContext } from './rules';
import { formatHour } from '../../../lib/time';
import { formatWind } from '../../../lib/units';
import type { Condition, HourlyForecast, WeatherReport } from '../../../types/weather';

const LOOKAHEAD_HOURS = 12;
const WET_POP = 50; // "likely"
const DRY_POP = 30; // "easing"
const GUSTY_MS = 14; // ~50 km/h

const isWet = (c: Condition) => c === 'Rain' || c === 'Drizzle' || c === 'Thunderstorm' || c === 'Snow';

const precipNoun = (h: HourlyForecast) => {
  if (h.condition === 'Snow') return 'Snow';
  if (h.condition === 'Thunderstorm') return 'Thunderstorms';
  return 'Rain';
};

/**
 * One sentence about the next few hours, shown at the top of the hourly card
 * (like Apple/Google Weather): precipitation timing first, then wind, then advice.
 */
export const getHourlySummary = (report: WeatherReport, ctx: InsightContext): string => {
  const hours = report.hourly.slice(0, LOOKAHEAD_HOURS + 1);
  const tz = report.timezone;
  const now = report.current;

  if (isWet(now.condition) && hours.length > 1) {
    const clears = hours.slice(1).find((h) => h.pop < DRY_POP && !isWet(h.condition));
    const noun = now.condition === 'Snow' ? 'Snow' : now.condition === 'Thunderstorm' ? 'Storms' : 'Rain';
    return clears
      ? `${noun} easing around ${formatHour(clears.time, tz)}.`
      : `${noun} continuing for the next ${LOOKAHEAD_HOURS} hours.`;
  }

  const wet = hours.slice(1).find((h) => h.pop >= WET_POP);
  if (wet) return `${precipNoun(wet)} likely around ${formatHour(wet.time, tz)}.`;

  const gusts = hours.map((h) => h.windGust ?? h.windSpeed);
  const maxGust = Math.max(...gusts, now.windGust ?? 0);
  if (maxGust >= GUSTY_MS) return `Wind gusts up to ${formatWind(maxGust, ctx.unit)} over the next hours.`;

  return getRecommendation(now, ctx).text;
};
