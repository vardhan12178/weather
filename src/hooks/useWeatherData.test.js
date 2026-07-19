jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), isCancel: jest.fn(() => false) },
}));

import { euAqiToIndex, normaliseForecast, normaliseWeather, wmoMap } from './useWeatherData';

describe('weather data normalisation', () => {
  test('maps WMO conditions and day/night icons', () => {
    expect(wmoMap(95, false)).toEqual({
      condition: 'Thunderstorm',
      description: 'thunderstorm',
      icon: '11n',
    });
  });

  test('converts European AQI into a five-level display index', () => {
    expect(euAqiToIndex(12)).toBe(1);
    expect(euAqiToIndex(39)).toBe(2);
    expect(euAqiToIndex(59)).toBe(3);
    expect(euAqiToIndex(78)).toBe(4);
    expect(euAqiToIndex(96)).toBe(5);
  });

  test('keeps API timestamps as Unix time and retains the real AQI value', () => {
    const weatherPayload = {
      latitude: 19.1,
      longitude: 72.9,
      utc_offset_seconds: 19800,
      timezone_abbreviation: 'IST',
      current: {
        time: 1_800_000_000,
        is_day: 1,
        weather_code: 2,
        temperature_2m: 28,
        apparent_temperature: 31,
        relative_humidity_2m: 82,
        pressure_msl: 1007.4,
        wind_speed_10m: 4,
        wind_direction_10m: 250,
        wind_gusts_10m: 9,
        cloud_cover: 60,
        precipitation: 0,
      },
      hourly: { time: [1_800_000_000], visibility: [8000], uv_index: [3] },
      daily: {
        sunrise: [1_799_980_000],
        sunset: [1_800_020_000],
        temperature_2m_max: [31],
        temperature_2m_min: [25],
        uv_index_max: [7],
      },
    };
    const airPayload = {
      current: { european_aqi: 37, pm2_5: 14, pm10: 25, nitrogen_dioxide: 9, ozone: 40 },
    };

    const result = normaliseWeather(weatherPayload, airPayload, { name: 'Mumbai', country_code: 'IN' });
    expect(result.weatherData.dt).toBe(1_800_000_000);
    expect(result.weatherData.timezone).toBe(19800);
    expect(result.weatherData.sys.country).toBe('IN');
    expect(result.normalisedAqi.main).toEqual({ aqi: 2, value: 37, scale: 'European AQI' });
  });

  test('builds location-local labels from timezone offsets', () => {
    const future = Math.floor(Date.now() / 3_600_000) * 3600 + 7200;
    const hourlyTimes = Array.from({ length: 6 }, (_, index) => future + index * 3600);
    const payload = {
      utc_offset_seconds: 19800,
      hourly: {
        time: hourlyTimes,
        temperature_2m: Array(6).fill(28),
        apparent_temperature: Array(6).fill(30),
        relative_humidity_2m: Array(6).fill(75),
        pressure_msl: Array(6).fill(1010),
        weather_code: Array(6).fill(1),
        wind_speed_10m: Array(6).fill(3),
        wind_direction_10m: Array(6).fill(180),
        precipitation_probability: Array(6).fill(20),
        visibility: Array(6).fill(10000),
      },
      daily: {
        time: [future],
        temperature_2m_min: [24],
        temperature_2m_max: [31],
        weather_code: [1],
        precipitation_probability_max: [20],
      },
    };

    const forecast = normaliseForecast(payload);
    const expectedDate = new Date((future + 19800) * 1000).toISOString().slice(0, 10);
    expect(forecast.list[0].localDateKey).toBe(expectedDate);
    expect(forecast.daily[0].localDateKey).toBe(expectedDate);
    expect(forecast.daily[0].main).toEqual({ temp_min: 24, temp_max: 31 });
  });
});
