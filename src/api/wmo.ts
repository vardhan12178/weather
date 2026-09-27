import type { Condition, ConditionInfo } from '../types/weather';

// WMO weather interpretation codes used by Open-Meteo:
// https://open-meteo.com/en/docs#weather_variable_documentation
// `icon` is the base of an OpenWeatherMap-style icon id; "d"/"n" is appended.
const TABLE: Record<number, { condition: Condition; description: string; icon: string }> = {
  0: { condition: 'Clear', description: 'Clear sky', icon: '01' },
  1: { condition: 'Clear', description: 'Mainly clear', icon: '01' },
  2: { condition: 'Clouds', description: 'Partly cloudy', icon: '02' },
  3: { condition: 'Clouds', description: 'Overcast', icon: '04' },
  45: { condition: 'Fog', description: 'Fog', icon: '50' },
  48: { condition: 'Fog', description: 'Freezing fog', icon: '50' },
  51: { condition: 'Drizzle', description: 'Light drizzle', icon: '09' },
  53: { condition: 'Drizzle', description: 'Drizzle', icon: '09' },
  55: { condition: 'Drizzle', description: 'Heavy drizzle', icon: '09' },
  56: { condition: 'Drizzle', description: 'Light freezing drizzle', icon: '09' },
  57: { condition: 'Drizzle', description: 'Freezing drizzle', icon: '09' },
  61: { condition: 'Rain', description: 'Light rain', icon: '10' },
  63: { condition: 'Rain', description: 'Rain', icon: '10' },
  65: { condition: 'Rain', description: 'Heavy rain', icon: '10' },
  66: { condition: 'Rain', description: 'Light freezing rain', icon: '13' },
  67: { condition: 'Rain', description: 'Freezing rain', icon: '13' },
  71: { condition: 'Snow', description: 'Light snow', icon: '13' },
  73: { condition: 'Snow', description: 'Snow', icon: '13' },
  75: { condition: 'Snow', description: 'Heavy snow', icon: '13' },
  77: { condition: 'Snow', description: 'Snow grains', icon: '13' },
  80: { condition: 'Rain', description: 'Light showers', icon: '09' },
  81: { condition: 'Rain', description: 'Showers', icon: '09' },
  82: { condition: 'Rain', description: 'Heavy showers', icon: '09' },
  85: { condition: 'Snow', description: 'Light snow showers', icon: '13' },
  86: { condition: 'Snow', description: 'Snow showers', icon: '13' },
  95: { condition: 'Thunderstorm', description: 'Thunderstorm', icon: '11' },
  96: { condition: 'Thunderstorm', description: 'Thunderstorm with hail', icon: '11' },
  99: { condition: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '11' },
};

export const describeWeatherCode = (code: number, isDay: boolean): ConditionInfo => {
  const entry = TABLE[code] ?? { condition: 'Clear', description: 'Unknown', icon: '01' };
  return {
    condition: entry.condition,
    description: entry.description,
    icon: `${entry.icon}${isDay ? 'd' : 'n'}`,
  };
};
