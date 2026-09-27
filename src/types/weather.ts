// Normalised, provider-independent weather model used by the whole UI.
// All values are METRIC (°C, m/s, metres, hPa, %); convert only for display
// via lib/units. All times are unix seconds (true UTC instants).

export type Unit = 'metric' | 'imperial';

export type Condition = 'Clear' | 'Clouds' | 'Fog' | 'Drizzle' | 'Rain' | 'Snow' | 'Thunderstorm';

export interface Place {
  lat: number;
  lon: number;
  /** Missing until reverse-geocoded (e.g. a raw GPS position) */
  name?: string;
  /** ISO 3166-1 alpha-2, upper case (e.g. "IN") */
  country?: string;
  /** State / region */
  admin1?: string;
}

export interface ConditionInfo {
  condition: Condition;
  description: string;
  /** Icon id in OpenWeatherMap style, e.g. "01d" / "10n" (see components/WeatherIcon) */
  icon: string;
}

export interface CurrentWeather extends ConditionInfo {
  time: number;
  isDay: boolean;
  temp: number;
  feelsLike: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  windGust: number | null;
  /** metres, capped at 10 km */
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  /** mm in the last hour */
  precipitation: number;
  sunrise: number;
  sunset: number;
}

export interface HourlyForecast extends ConditionInfo {
  time: number;
  isDay: boolean;
  temp: number;
  feelsLike: number;
  humidity: number;
  /** Probability of precipitation, 0–100 */
  pop: number;
  /** mm expected in this hour */
  precipitation: number;
  windSpeed: number;
  windDeg: number;
  windGust: number | null;
  uvIndex: number;
}

export interface DailyForecast extends ConditionInfo {
  /** Local midnight of the day */
  time: number;
  tempMax: number;
  tempMin: number;
  /** Max probability of precipitation, 0–100 */
  pop: number;
  sunrise: number;
  sunset: number;
  uvIndexMax: number;
}

/** 1 Good · 2 Fair · 3 Moderate · 4 Poor · 5 Very poor (European AQI bands) */
export type AqiLevel = 1 | 2 | 3 | 4 | 5;

export interface AirQuality {
  europeanAqi: number;
  level: AqiLevel;
  pm2_5: number | null;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
  so2: number | null;
  co: number | null;
  dust: number | null;
}

export interface WeatherReport {
  lat: number;
  lon: number;
  /** IANA zone of the location, e.g. "Asia/Kolkata" */
  timezone: string;
  utcOffset: number;
  current: CurrentWeather;
  /** Next 48 hours in 1-hour steps, starting with the current hour */
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airQuality: AirQuality | null;
  /** When this report was fetched (ms) */
  fetchedAt: number;
}

/** Light-weight "now" reading, used for saved-place cards */
export interface WeatherSnapshot extends ConditionInfo {
  temp: number;
  isDay: boolean;
}

export type WeatherErrorCode = 'not-found' | 'network' | 'offline' | 'geo-denied' | 'geo-unavailable';
