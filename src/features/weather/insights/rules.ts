import { formatTemp, formatWind } from '../../../lib/units';
import { localHour, localMonth } from '../../../lib/time';
import type { CurrentWeather, Unit } from '../../../types/weather';

// Pure rules for the alert banner and the advice line. Inputs are metric, so
// thresholds are in °C and m/s; `unit` only affects the wording.

export interface InsightContext {
  unit: Unit;
  timezone: string;
  /** ISO country code of the place — India-specific advice only shows in India */
  country?: string;
}

export type AlertKind = 'storm' | 'heat' | 'freeze' | 'monsoon' | 'fog' | 'wind' | 'rain' | 'uv';
export type AlertTone = 'amber' | 'red' | 'orange' | 'sky' | 'blue' | 'slate' | 'purple';

export interface WeatherAlert {
  kind: AlertKind;
  tone: AlertTone;
  title: string;
  message: string;
}

export type RecommendationTone = 'warm' | 'wet' | 'cool' | 'pleasant' | 'neutral';

export interface Recommendation {
  emoji: string;
  text: string;
  tone: RecommendationTone;
}

const isWet = (c: CurrentWeather) => c.condition === 'Rain' || c.condition === 'Drizzle';

const inIndia = (ctx: InsightContext) => ctx.country === 'IN';

export const getAlert = (c: CurrentWeather, ctx: InsightContext): WeatherAlert | null => {
  const month = localMonth(c.time, ctx.timezone);
  const temp = formatTemp(c.temp, ctx.unit);

  if (c.condition === 'Thunderstorm') {
    return {
      kind: 'storm', tone: 'amber', title: 'Severe weather advisory',
      message: 'Thunderstorms nearby. Avoid open areas, tall trees, and flooded roads.',
    };
  }
  if (c.temp >= 40) {
    return {
      kind: 'heat', tone: 'red', title: 'Heat wave alert',
      message: `Extreme heat: ${temp}. Avoid going out between 11 am and 4 pm, drink plenty of fluids and wear light clothing.`,
    };
  }
  if (c.temp >= 35) {
    return {
      kind: 'heat', tone: 'orange', title: 'Heat advisory',
      message: `It's ${temp}. Stay hydrated and limit direct sun exposure.`,
    };
  }
  if (c.temp < 0) {
    return {
      kind: 'freeze', tone: 'sky', title: 'Freeze advisory',
      message: `It's ${temp}. Roads and surfaces may be icy and slippery.`,
    };
  }
  if (inIndia(ctx) && month >= 6 && month <= 9 && isWet(c)) {
    return {
      kind: 'monsoon', tone: 'blue', title: 'Monsoon active',
      message: 'Watch for waterlogging, flash floods, and landslides in hilly areas.',
    };
  }
  if (c.condition === 'Fog' && c.visibility < 1000) {
    return {
      kind: 'fog', tone: 'slate', title: 'Dense fog advisory',
      message: `Visibility is under 1 km. Use fog lights, slow down and keep extra distance while driving.`,
    };
  }
  if (c.windSpeed > 15) {
    return {
      kind: 'wind', tone: 'orange', title: 'High wind advisory',
      message: `Winds near ${formatWind(c.windSpeed, ctx.unit)}. Secure loose objects and avoid exposed areas.`,
    };
  }
  if (isWet(c)) {
    return {
      kind: 'rain', tone: 'blue', title: 'Rain expected',
      message: 'Carry an umbrella and allow extra travel time if heading out.',
    };
  }
  if (c.isDay && c.uvIndex >= 11) {
    return {
      kind: 'uv', tone: 'purple', title: 'Extreme UV',
      message: `UV index ${Math.round(c.uvIndex)}. Avoid the midday sun; wear SPF 50+, sunglasses and a hat.`,
    };
  }
  if (c.isDay && c.uvIndex >= 8) {
    return {
      kind: 'uv', tone: 'orange', title: 'Very high UV',
      message: `UV index ${Math.round(c.uvIndex)}. Apply sunscreen and seek shade around midday.`,
    };
  }
  return null;
};

export const getRecommendation = (c: CurrentWeather, ctx: InsightContext): Recommendation => {
  const hour = localHour(c.time, ctx.timezone);
  const month = localMonth(c.time, ctx.timezone);
  const isNight = !c.isDay;
  const isEvening = hour >= 17 && hour < 20;
  const temp = formatTemp(c.temp, ctx.unit);

  if (c.condition === 'Thunderstorm') {
    return { emoji: '⛈️', tone: 'wet', text: 'Severe storm. Stay indoors, unplug electronics and keep emergency numbers handy.' };
  }
  if (c.condition === 'Fog') {
    return { emoji: '🌫️', tone: 'cool', text: 'Foggy out there. Drive slowly, use fog lights and allow extra travel time.' };
  }
  if (inIndia(ctx) && month >= 6 && month <= 9 && isWet(c)) {
    return { emoji: '☔', tone: 'wet', text: 'Monsoon is active. Carry a rain jacket, watch for waterlogged roads and check flood alerts before stepping out.' };
  }
  if (isWet(c)) {
    return { emoji: '🌧️', tone: 'wet', text: "It's raining. Grab an umbrella and watch your step on slippery roads." };
  }
  if (c.condition === 'Snow') {
    return { emoji: '❄️', tone: 'cool', text: 'Snowfall. Dress in layers, wear non-slip footwear and drive carefully on icy roads.' };
  }
  if (c.temp >= 42) {
    return { emoji: '🔥', tone: 'warm', text: 'Brutal heat. Avoid outdoor activity, keep water handy and check on elderly neighbours.' };
  }
  if (c.temp >= 35 && !isNight) {
    return { emoji: '☀️', tone: 'warm', text: 'Scorching afternoon. Stay indoors between 11 am and 4 pm, wear SPF 50+ and drink plenty of water.' };
  }
  if (c.temp > 30) {
    return { emoji: '🌡️', tone: 'warm', text: `It's ${temp} and hot. Stay hydrated, wear light clothing and use sunscreen if heading out.` };
  }
  if (c.condition === 'Clear' && !isNight && c.temp > 22) {
    return isEvening
      ? { emoji: '🌅', tone: 'warm', text: 'Beautiful clear evening — perfect for a walk.' }
      : { emoji: '🕶️', tone: 'warm', text: 'Clear and sunny. UV peaks around midday — wear sunglasses and sunscreen.' };
  }
  if (c.condition === 'Clear' && isNight) {
    return { emoji: '🌙', tone: 'neutral', text: 'Clear night sky — a great time for stargazing away from city lights.' };
  }
  if (c.temp < 10) {
    return { emoji: '🧥', tone: 'cool', text: "It's chilly. Layer up before heading out." };
  }
  if (c.temp >= 18 && c.temp <= 28 && c.windSpeed < 5) {
    return isNight
      ? { emoji: '😊', tone: 'pleasant', text: 'Pleasant, calm night — comfortable for an evening stroll.' }
      : { emoji: '😊', tone: 'pleasant', text: 'Lovely weather — comfortable for a walk or time outdoors.' };
  }
  if (c.windSpeed > 10) {
    return { emoji: '💨', tone: 'neutral', text: `Strong winds around ${formatWind(c.windSpeed, ctx.unit)}. Secure loose items outdoors.` };
  }
  if (c.humidity > 80) {
    return { emoji: '💧', tone: 'neutral', text: `Humidity at ${c.humidity}% — it feels muggy. Light clothes and plenty of water will help.` };
  }
  return { emoji: '🌤️', tone: 'neutral', text: `${temp} and ${c.description.toLowerCase()}. Enjoy your day!` };
};
