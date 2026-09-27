import { describe, expect, it } from 'vitest';
import { getHourlySummary } from './summary';
import type { InsightContext } from './rules';
import type { CurrentWeather, HourlyForecast, WeatherReport } from '../../../types/weather';

const HOUR = 3600;
// 2026-09-27 14:00 IST
const T0 = Date.UTC(2026, 8, 27, 8, 30) / 1000;
const ctx: InsightContext = { unit: 'metric', timezone: 'Asia/Kolkata', country: 'IN' };

const current: CurrentWeather = {
  condition: 'Clouds', description: 'Partly cloudy', icon: '02d', time: T0, isDay: true,
  temp: 24, feelsLike: 24, tempMax: 27, tempMin: 18, humidity: 60, pressure: 1012,
  windSpeed: 3, windDeg: 200, windGust: null, visibility: 10_000, uvIndex: 3,
  cloudCover: 40, precipitation: 0, sunrise: 0, sunset: 0,
};

const hour = (i: number, o: Partial<HourlyForecast> = {}): HourlyForecast => ({
  condition: 'Clouds', description: 'Partly cloudy', icon: '02d', time: T0 + i * HOUR, isDay: true,
  temp: 24, feelsLike: 24, humidity: 60, pop: 0, precipitation: 0, windSpeed: 3, windDeg: 200,
  windGust: null, uvIndex: 3, ...o,
});

const report = (cur: Partial<CurrentWeather>, hours: (i: number) => Partial<HourlyForecast>): WeatherReport => ({
  lat: 0, lon: 0, timezone: 'Asia/Kolkata', utcOffset: 19800, fetchedAt: 0, airQuality: null, daily: [],
  current: { ...current, ...cur },
  hourly: Array.from({ length: 24 }, (_, i) => hour(i, hours(i))),
});

describe('getHourlySummary', () => {
  it('says when rain is likely to start', () => {
    const r = report({}, (i) => (i >= 2 ? { pop: 70, condition: 'Rain' } : {}));
    expect(getHourlySummary(r, ctx)).toMatch(/^Rain likely around 4\s?pm\.$/i);
  });

  it('says when current rain eases', () => {
    const r = report({ condition: 'Rain' }, (i) => (i < 3 ? { pop: 80, condition: 'Rain' } : { pop: 10 }));
    expect(getHourlySummary(r, ctx)).toMatch(/^Rain easing around 5\s?pm\.$/i);
  });

  it('names snow and storms', () => {
    const r = report({}, (i) => (i === 1 ? { pop: 60, condition: 'Snow' } : {}));
    expect(getHourlySummary(r, ctx)).toMatch(/^Snow likely/);
  });

  it('mentions strong gusts in the chosen unit', () => {
    const r = report({}, (i) => (i === 5 ? { windGust: 20 } : {}));
    expect(getHourlySummary(r, { ...ctx, unit: 'imperial' })).toContain('45 mph');
  });

  it('falls back to friendly advice on a quiet day', () => {
    const r = report({}, () => ({}));
    expect(getHourlySummary(r, ctx).length).toBeGreaterThan(10);
  });
});
