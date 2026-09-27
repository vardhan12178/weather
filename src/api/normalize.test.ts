import { describe, expect, it } from 'vitest';
import { aqiLevel, hourIndexAt, normalizeAirQuality, normalizeReport } from './normalize';
import type { RawForecast } from './openMeteo';

const HOUR = 3600;
const DAY = 24 * HOUR;
const MIDNIGHT = Date.UTC(2026, 8, 26, 18, 30) / 1000; // 2026-09-27 00:00 IST

const makeRaw = (): RawForecast => {
  const hours = 72;
  const time = Array.from({ length: hours }, (_, i) => MIDNIGHT + i * HOUR);
  return {
    latitude: 17.375,
    longitude: 78.5,
    timezone: 'Asia/Kolkata',
    utc_offset_seconds: 19800,
    current: {
      // 14:05 local — on the 15-minute grid, not on the hour
      time: MIDNIGHT + 14 * HOUR + 5 * 60,
      temperature_2m: 31,
      relative_humidity_2m: 58,
      apparent_temperature: 34,
      is_day: 1,
      precipitation: 0,
      weather_code: 63,
      cloud_cover: 70,
      pressure_msl: 1008.6,
      wind_speed_10m: 4.2,
      wind_direction_10m: 245,
      wind_gusts_10m: 9.1,
    },
    hourly: {
      time,
      temperature_2m: time.map((_, i) => 20 + (i % 24)),
      relative_humidity_2m: time.map(() => 60),
      apparent_temperature: time.map((_, i) => 22 + (i % 24)),
      precipitation_probability: time.map((_, i) => (i === 15 ? null : i % 100)),
      weather_code: time.map(() => 2),
      is_day: time.map((_, i) => (i % 24 >= 6 && i % 24 < 18 ? 1 : 0)),
      wind_speed_10m: time.map(() => 3),
      wind_direction_10m: time.map(() => 240),
      uv_index: time.map((_, i) => i % 24),
      visibility: time.map((_, i) => (i === 14 ? 24_000 : 8_000)),
    },
    daily: {
      time: [0, 1, 2].map((d) => MIDNIGHT + d * DAY),
      weather_code: [63, 0, 95],
      temperature_2m_max: [32, 30, 28],
      temperature_2m_min: [21, 20, 19],
      sunrise: [0, 1, 2].map((d) => MIDNIGHT + d * DAY + 6 * HOUR),
      sunset: [0, 1, 2].map((d) => MIDNIGHT + d * DAY + 18 * HOUR),
      uv_index_max: [9, 8, null],
      precipitation_probability_max: [80, 10, null],
    },
  };
};

describe('hourIndexAt', () => {
  it('finds the slot that contains the time', () => {
    expect(hourIndexAt([0, 3600, 7200], 3700)).toBe(1);
    expect(hourIndexAt([0, 3600, 7200], 3600)).toBe(1);
    expect(hourIndexAt([0, 3600, 7200], 99999)).toBe(2);
    expect(hourIndexAt([100, 200], 50)).toBe(0);
  });
});

describe('normalizeReport', () => {
  const report = normalizeReport(makeRaw(), null, 123);

  it('maps the current condition (the bug fixed in phase 1)', () => {
    expect(report.current.condition).toBe('Rain');
    expect(report.current.icon).toBe('10d');
    expect(report.current.isDay).toBe(true);
  });

  it('reads UV and visibility from the current hour, not midnight', () => {
    expect(report.current.uvIndex).toBe(14);
    expect(report.current.visibility).toBe(10_000); // capped
  });

  it('starts the hourly list at the current hour in 1-hour steps', () => {
    expect(report.hourly[0].time).toBe(MIDNIGHT + 14 * HOUR);
    expect(report.hourly[1].time - report.hourly[0].time).toBe(HOUR);
    expect(report.hourly).toHaveLength(48);
    expect(report.hourly[1].pop).toBe(0); // null → 0
    expect(report.hourly[4].isDay).toBe(false); // 18:00
  });

  it('uses the API daily data directly', () => {
    expect(report.daily.map((d) => d.condition)).toEqual(['Rain', 'Clear', 'Thunderstorm']);
    expect(report.daily[2].pop).toBe(0);
    expect(report.daily[2].uvIndexMax).toBe(0);
    expect(report.current.tempMax).toBe(32);
    expect(report.current.sunrise).toBe(MIDNIGHT + 6 * HOUR);
  });

  it('keeps location metadata', () => {
    expect(report.timezone).toBe('Asia/Kolkata');
    expect(report.fetchedAt).toBe(123);
    expect(report.airQuality).toBeNull();
  });
});

describe('air quality', () => {
  it('bands the European AQI', () => {
    expect([10, 20, 21, 47, 61, 81].map(aqiLevel)).toEqual([1, 1, 2, 3, 4, 5]);
  });

  it('returns null when AQI is missing', () => {
    expect(normalizeAirQuality(null)).toBeNull();
    expect(normalizeAirQuality({ current: undefined })).toBeNull();
  });

  it('normalises pollutant names', () => {
    const aq = normalizeAirQuality({
      current: {
        european_aqi: 47, pm10: 48.3, pm2_5: 27.9, carbon_monoxide: 310,
        nitrogen_dioxide: 18.2, ozone: 64, sulphur_dioxide: 6.1, dust: 3,
      },
    });
    expect(aq).toMatchObject({ level: 3, pm2_5: 27.9, no2: 18.2, o3: 64 });
  });
});
