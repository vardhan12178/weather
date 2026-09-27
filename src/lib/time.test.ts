import { describe, expect, it } from 'vitest';
import { formatClock, formatHour, localHour, localMonth } from './time';

// 2026-09-27 06:07 in Asia/Kolkata (UTC+5:30) = 00:37 UTC
const SUNRISE_IST = Date.UTC(2026, 8, 27, 0, 37) / 1000;

describe('time', () => {
  it("formats in the location's zone, not the viewer's", () => {
    expect(formatClock(SUNRISE_IST, 'Asia/Kolkata')).toMatch(/^6:07\s?AM$/i);
    expect(formatClock(SUNRISE_IST, 'America/New_York')).toMatch(/^8:37\s?PM$/i);
    expect(formatHour(SUNRISE_IST, 'Asia/Kolkata')).toMatch(/^6\s?AM$/i);
  });

  it('returns the local hour and month', () => {
    expect(localHour(SUNRISE_IST, 'Asia/Kolkata')).toBe(6);
    expect(localHour(SUNRISE_IST, 'UTC')).toBe(0);
    expect(localMonth(SUNRISE_IST, 'Asia/Kolkata')).toBe(9);
  });

  it('falls back gracefully on an invalid zone', () => {
    expect(() => formatClock(SUNRISE_IST, 'Not/AZone')).not.toThrow();
  });
});
