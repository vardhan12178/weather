import type { Ref } from 'react';
import WeatherIcon from '../../components/WeatherIcon';
import { convertTemp, formatTemp } from '../../lib/units';
import type { CurrentWeather, Unit } from '../../types/weather';

interface HeroProps {
  current: CurrentWeather;
  unit: Unit;
  /** e.g. "Updated 3 min ago" */
  status: string;
  ref?: Ref<HTMLElement>;
}

/** The big temperature. The top bar watches this to know when to go compact. */
const Hero = ({ current, unit, status, ref }: HeroProps) => (
  <section ref={ref} aria-label="Current conditions" className="flex flex-col items-center pb-2 pt-4 text-center lg:items-start lg:pt-8 lg:text-left">
    {/* Proportional figures read better at display size (no tabular-nums here) */}
    <p className="text-hero font-light tracking-tighter">
      {Math.round(convertTemp(current.temp, unit))}
      <span className="font-light">°</span>
    </p>
    <p className="mt-1 flex items-center gap-2 text-title font-semibold">
      <WeatherIcon code={current.icon} size={32} className="drop-shadow" />
      {current.description}
    </p>
    <p className="mt-1 text-body text-white/85">
      H: {formatTemp(current.tempMax, unit)} · L: {formatTemp(current.tempMin, unit)} · Feels like {formatTemp(current.feelsLike, unit)}
    </p>
    <p className="mt-2 text-footnote text-white/85" aria-live="polite">
      {status}
    </p>
  </section>
);

export default Hero;
