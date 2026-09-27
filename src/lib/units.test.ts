import { describe, expect, it } from 'vitest';
import { compassDirection, convertDistance, convertWind, dewPoint, formatTemp, formatWind } from './units';

describe('units', () => {
  it('formats temperatures in the chosen unit', () => {
    expect(formatTemp(24, 'metric')).toBe('24°');
    expect(formatTemp(24, 'imperial')).toBe('75°');
    expect(formatTemp(-0.4, 'metric')).toBe('0°');
    expect(formatTemp(0, 'imperial')).toBe('32°');
  });

  it('converts wind from m/s to km/h or mph', () => {
    expect(convertWind(10, 'metric')).toBeCloseTo(36);
    expect(convertWind(10, 'imperial')).toBeCloseTo(22.37, 1);
    expect(formatWind(5, 'metric')).toBe('18 km/h');
    expect(formatWind(5, 'imperial')).toBe('11 mph');
  });

  it('converts visibility from metres', () => {
    expect(convertDistance(10_000, 'metric')).toBe(10);
    expect(convertDistance(10_000, 'imperial')).toBeCloseTo(6.21, 2);
  });

  it('computes dew point in °C', () => {
    expect(dewPoint(20, 50)).toBeCloseTo(9.3, 1);
    expect(dewPoint(30, 100)).toBeCloseTo(30, 0);
  });

  it('maps wind degrees to compass points', () => {
    expect(compassDirection(0)).toBe('N');
    expect(compassDirection(245)).toBe('WSW');
    expect(compassDirection(359)).toBe('N');
    expect(compassDirection(-90)).toBe('W');
  });
});
