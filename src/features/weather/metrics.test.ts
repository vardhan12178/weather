import { describe, expect, it } from 'vitest';
import { daylightLength, formatPrecip, precipitationOutlook, sunProgress, uvLevel, uvProtectionNote } from './metrics';
import type { HourlyForecast, WeatherReport } from '../../types/weather';

const HOUR = 3600;
const T0 = Date.UTC(2026, 8, 27, 4, 30) / 1000; // 10:00 IST

const hour = (i: number, o: Partial<HourlyForecast> = {}): HourlyForecast => ({
  condition: 'Clear', description: 'Clear sky', icon: '01d', time: T0 + i * HOUR, isDay: true,
  temp: 24, feelsLike: 24, humidity: 60, pop: 0, precipitation: 0, windSpeed: 3, windDeg: 0,
  windGust: null, uvIndex: 0, ...o,
});

describe('metrics', () => {
  it('bands UV', () => {
    expect([0, 3, 6, 9, 11].map((u) => uvLevel(u).label)).toEqual(['Low', 'Moderate', 'High', 'Very high', 'Extreme']);
  });

  it('says until when sun protection is needed', () => {
    // UV >= 3 from 10:00 through 15:00 → protect until 4 pm
    const hourly = Array.from({ length: 24 }, (_, i) => hour(i, { uvIndex: i <= 5 ? 6 : 1 }));
    const report = { hourly, timezone: 'Asia/Kolkata', current: { uvIndex: 6 } } as unknown as WeatherReport;
    expect(uvProtectionNote(report)).toMatch(/until 4\s?pm/i);

    const low = { ...report, hourly: hourly.map((h) => ({ ...h, uvIndex: 1 })) } as WeatherReport;
    expect(uvProtectionNote(low)).toBe('Low for the rest of the day.');
  });

  it('sums precipitation over the next 24 hours', () => {
    const hourly = Array.from({ length: 48 }, (_, i) => hour(i, { precipitation: i < 24 ? 0.5 : 9, pop: i === 3 ? 80 : 10 }));
    expect(precipitationOutlook(hourly)).toEqual({ total: 12, maxPop: 80 });
    expect(formatPrecip(0.4)).toBe('0.4 mm');
    expect(formatPrecip(0)).toBe('0 mm');
    expect(formatPrecip(12.4)).toBe('12 mm');
  });

  it('tracks the sun between sunrise and sunset', () => {
    expect(sunProgress(50, 0, 100)).toBe(0.5);
    expect(sunProgress(150, 0, 100)).toBeNull();
    expect(daylightLength(0, 11 * HOUR + 58 * 60)).toBe('11 h 58 min');
  });
});
