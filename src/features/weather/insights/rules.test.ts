import { describe, expect, it } from 'vitest';
import { getAlert, getRecommendation, type InsightContext } from './rules';
import type { CurrentWeather } from '../../../types/weather';

// 2026-07-15 14:00 in India (UTC+5:30) — monsoon season, daytime
const JULY_AFTERNOON = Date.UTC(2026, 6, 15, 8, 30) / 1000;
// 2026-09-27 22:00 in India
const SEPT_NIGHT = Date.UTC(2026, 8, 27, 16, 30) / 1000;

const base: CurrentWeather = {
  condition: 'Clouds', description: 'Partly cloudy', icon: '02d',
  time: JULY_AFTERNOON, isDay: true,
  temp: 24, feelsLike: 24, tempMax: 27, tempMin: 18,
  humidity: 60, pressure: 1012,
  windSpeed: 3, windDeg: 200, windGust: null,
  visibility: 10_000, uvIndex: 3, cloudCover: 40, precipitation: 0,
  sunrise: 0, sunset: 0,
};

const india: InsightContext = { unit: 'metric', timezone: 'Asia/Kolkata', country: 'IN' };
const uk: InsightContext = { unit: 'metric', timezone: 'Europe/London', country: 'GB' };

const weather = (overrides: Partial<CurrentWeather>): CurrentWeather => ({ ...base, ...overrides });

describe('getAlert', () => {
  it('flags thunderstorms first', () => {
    expect(getAlert(weather({ condition: 'Thunderstorm', temp: 41 }), india)?.kind).toBe('storm');
  });

  it('uses °C thresholds regardless of display unit', () => {
    // 24 °C shows as 75 °F — must not be a heat alert
    expect(getAlert(weather({ temp: 24 }), { ...india, unit: 'imperial' })).toBeNull();
    const heat = getAlert(weather({ temp: 36 }), { ...india, unit: 'imperial' });
    expect(heat?.kind).toBe('heat');
    expect(heat?.message).toContain('97°');
  });

  it('only shows monsoon alerts in India', () => {
    const rain = weather({ condition: 'Rain' });
    expect(getAlert(rain, india)?.kind).toBe('monsoon');
    expect(getAlert(rain, uk)).toBeNull(); // everyday rain goes in the summary line
  });

  it('formats wind in the chosen unit', () => {
    const windy = weather({ windSpeed: 20 });
    expect(getAlert(windy, india)?.message).toContain('72 km/h');
    expect(getAlert(windy, { ...india, unit: 'imperial' })?.message).toContain('45 mph');
  });

  it('only warns about extreme UV, and never at night', () => {
    expect(getAlert(weather({ uvIndex: 9 }), india)).toBeNull();
    expect(getAlert(weather({ uvIndex: 11 }), india)?.kind).toBe('uv');
    expect(getAlert(weather({ uvIndex: 11, isDay: false }), india)).toBeNull();
  });
});

describe('getRecommendation', () => {
  it('handles mild overcast weather (used to crash the app)', () => {
    const rec = getRecommendation(weather({ condition: 'Clouds', description: 'Overcast', temp: 14, humidity: 60 }), uk);
    expect(rec.text).toContain('overcast');
  });

  it("doesn't suggest daytime activities at night", () => {
    const rec = getRecommendation(weather({ time: SEPT_NIGHT, isDay: false, temp: 22 }), india);
    expect(rec.text).toMatch(/night/i);
  });

  it('gives rain advice when it rains', () => {
    expect(getRecommendation(weather({ condition: 'Rain' }), uk).tone).toBe('wet');
  });
});
