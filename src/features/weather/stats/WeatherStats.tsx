import { Wind, Droplet, Eye, Activity, Thermometer, Sun } from 'react-feather';
import MetricWidget, { MetricTrack, MetricValue } from './MetricWidget';
import SunArc from './SunArc';
import { cardClass, textPrimary } from '../../../components/ui';
import {
  compassDirection,
  convertDistance,
  convertWind,
  dewPoint,
  distanceUnitLabel,
  formatTemp,
  windUnitLabel,
} from '../../../lib/units';
import type { CurrentWeather, Unit } from '../../../types/weather';

const uvDetails = (uv: number) => {
  const val = Math.round(uv);
  const pct = Math.min(100, (val / 12) * 100);
  if (val <= 2) return { label: 'Low', color: 'text-emerald-500', marker: 'border-emerald-500', pct, desc: 'Safe to stay outdoors.' };
  if (val <= 5) return { label: 'Moderate', color: 'text-yellow-500', marker: 'border-yellow-500', pct, desc: 'Wear sunscreen, seek shade.' };
  if (val <= 7) return { label: 'High', color: 'text-orange-500', marker: 'border-orange-500', pct, desc: 'Protection needed. Stay in shade.' };
  if (val <= 10) return { label: 'Very high', color: 'text-red-500', marker: 'border-red-500', pct, desc: 'Extra protection required.' };
  return { label: 'Extreme', color: 'text-purple-500', marker: 'border-purple-500', pct, desc: 'Avoid the midday sun.' };
};

const feelsLikeDesc = (diffC: number) => {
  if (Math.abs(diffC) < 1.5) return 'Similar to the actual temperature.';
  return diffC > 0 ? 'Feels warmer due to humidity.' : 'Feels cooler due to wind.';
};

const humidityDesc = (h: number) => {
  if (h > 70) return 'Muggy conditions. Moisture is high.';
  if (h < 35) return 'Dry air. Moisturize your skin.';
  return 'Comfortable range of air moisture.';
};

const visibilityDesc = (meters: number) => {
  if (meters >= 9500) return 'Excellent clarity. Visible to the horizon.';
  if (meters >= 5000) return 'Good visibility. Slight haze.';
  return 'Reduced visibility. Drive with caution.';
};

const pressureDesc = (hPa: number) => {
  if (hPa > 1018) return 'High pressure. Stable and clear.';
  if (hPa < 1008) return 'Low pressure. Rain or clouds likely.';
  return 'Typical atmospheric pressure.';
};

interface WeatherStatsProps {
  current: CurrentWeather;
  timezone: string;
  unit: Unit;
}

const WeatherStats = ({ current, timezone, unit }: WeatherStatsProps) => {
  const uv = uvDetails(current.uvIndex);
  const diffC = current.feelsLike - current.temp;
  const windLabel = windUnitLabel(unit);

  return (
    <div className={`p-4 sm:p-7 md:p-8 ${cardClass} w-full flex flex-col gap-6`}>
      <h3 className={`${textPrimary} font-bold text-xs uppercase tracking-wider opacity-70`}>Weather details</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        <MetricWidget
          icon={Wind}
          title="Wind"
          description={
            current.windGust != null
              ? `Gusts up to ${Math.round(convertWind(current.windGust, unit))} ${windLabel}.`
              : `From the ${compassDirection(current.windDeg)}.`
          }
        >
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 shrink-0">
              <svg viewBox="0 0 40 40" className="w-full h-full text-slate-800 dark:text-slate-200" aria-hidden="true">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
                <g transform={`rotate(${current.windDeg}, 20, 20)`}>
                  <polygon points="20,4 16,16 20,13 24,16" fill="#2f6bed" />
                  <polygon points="20,36 16,24 20,27 24,24" fill="currentColor" opacity="0.3" />
                </g>
              </svg>
            </div>
            <div>
              <MetricValue value={Math.round(convertWind(current.windSpeed, unit))} unit={windLabel} />
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-300">{compassDirection(current.windDeg)}</span>
            </div>
          </div>
        </MetricWidget>

        <MetricWidget icon={Droplet} title="Humidity" description={humidityDesc(current.humidity)}>
          <MetricValue value={current.humidity} unit="%" />
          <MetricTrack pct={current.humidity} fill="bg-linear-to-r from-brand-400 to-brand-600" />
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-2">
            Dew point {formatTemp(dewPoint(current.temp, current.humidity), unit)}
          </p>
        </MetricWidget>

        <MetricWidget icon={Sun} title="UV index" description={uv.desc}>
          <span className={`text-2xl font-semibold ${uv.color} whitespace-nowrap`}>
            {Math.round(current.uvIndex)} <span className="text-base">{uv.label}</span>
          </span>
          <MetricTrack
            pct={uv.pct}
            trackClass="bg-linear-to-r from-emerald-500 via-yellow-400 via-orange-500 via-red-500 to-purple-600"
            markerClass={uv.marker}
          />
        </MetricWidget>

        <MetricWidget icon={Thermometer} title="Feels like" description={feelsLikeDesc(diffC)}>
          <MetricValue value={formatTemp(current.feelsLike, unit)} />
          <MetricTrack
            pct={50 + (diffC / 10) * 50}
            markerClass={diffC > 1.5 ? 'border-orange-500' : diffC < -1.5 ? 'border-sky-400' : 'border-slate-400'}
          />
        </MetricWidget>

        <MetricWidget icon={Eye} title="Visibility" description={visibilityDesc(current.visibility)}>
          <MetricValue value={Math.round(convertDistance(current.visibility, unit))} unit={distanceUnitLabel(unit)} />
          <MetricTrack pct={(current.visibility / 10_000) * 100} fill="bg-linear-to-r from-brand-300 to-brand-500" />
        </MetricWidget>

        <MetricWidget icon={Activity} title="Pressure" description={pressureDesc(current.pressure)}>
          <MetricValue value={current.pressure} unit="hPa" />
          <MetricTrack pct={((current.pressure - 980) / 60) * 100} />
        </MetricWidget>
      </div>

      <div className="h-px bg-slate-950/5 dark:bg-white/5 my-2" />

      <SunArc sunrise={current.sunrise} sunset={current.sunset} timezone={timezone} />
    </div>
  );
};

export default WeatherStats;
