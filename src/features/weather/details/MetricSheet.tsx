import type { ReactNode } from 'react';
import Sheet from '../../../components/Sheet';
import HourlyChart, { type ChartSeries } from './HourlyChart';
import { Compass, SunArc } from '../tiles/visuals';
import {
  AQI_LEVELS,
  UV_LEVELS,
  daylightLength,
  feelsLikeNote,
  formatPrecip,
  humidityNote,
  precipitationOutlook,
  pressureNote,
  sunProgress,
  uvLevel,
  uvProtectionNote,
  visibilityNote,
  type MetricId,
} from '../metrics';
import { formatClock } from '../../../lib/time';
import { useNow } from '../../../lib/useNow';
import {
  compassDirection,
  convertDistance,
  convertTemp,
  convertWind,
  dewPoint,
  distanceUnitLabel,
  formatTemp,
  formatWind,
  windUnitLabel,
} from '../../../lib/units';
import type { Unit, WeatherReport } from '../../../types/weather';

const S1 = 'var(--color-series-1)';
const S2 = 'var(--color-series-2)';

const TITLES: Record<MetricId, string> = {
  feelsLike: 'Feels like',
  uv: 'UV index',
  wind: 'Wind',
  precipitation: 'Precipitation',
  airQuality: 'Air quality',
  humidity: 'Humidity',
  visibility: 'Visibility',
  pressure: 'Pressure',
  sun: 'Sunrise & sunset',
};

const Headline = ({ value, note }: { value: ReactNode; note: string }) => (
  <div className="mb-4">
    <p className="text-large font-medium">{value}</p>
    <p className="mt-1 text-body text-white/85">{note}</p>
  </div>
);

const Facts = ({ items }: { items: [string, ReactNode][] }) => (
  <dl className="mt-4 divide-y divide-white/10 rounded-2xl bg-surface-raised px-4">
    {items.map(([k, v]) => (
      <div key={k} className="flex min-h-11 items-center justify-between gap-4 py-2 text-body">
        <dt className="text-white/85">{k}</dt>
        <dd className="text-right font-semibold tnum">{v}</dd>
      </div>
    ))}
  </dl>
);

const Explainer = ({ children }: { children: ReactNode }) => <p className="mt-4 text-footnote text-white/85">{children}</p>;

interface MetricSheetProps {
  metric: MetricId | null;
  onClose: () => void;
  report: WeatherReport;
  unit: Unit;
}

const MetricSheet = ({ metric, onClose, report, unit }: MetricSheetProps) => {
  const now = useNow();
  const c = report.current;
  const tz = report.timezone;
  const hours = report.hourly.slice(0, 24);
  const times = hours.map((h) => h.time);

  const chart = (label: string, series: ChartSeries[], kind: 'line' | 'bar', format: (v: number) => string, domain?: [number, number]) => (
    <HourlyChart label={label} times={times} timezone={tz} series={series} kind={kind} format={format} domain={domain} />
  );

  const renderContent = (id: MetricId): ReactNode => {
    switch (id) {
      case 'feelsLike':
        return (
          <>
            <Headline value={formatTemp(c.feelsLike, unit)} note={`${feelsLikeNote(c)} Actual temperature ${formatTemp(c.temp, unit)}.`} />
            {chart(
              'Temperature and feels-like temperature, next 24 hours',
              [
                { name: 'Temperature', color: S1, values: hours.map((h) => convertTemp(h.temp, unit)) },
                { name: 'Feels like', color: S2, values: hours.map((h) => convertTemp(h.feelsLike, unit)) },
              ],
              'line',
              (v) => `${Math.round(v)}°`,
            )}
            <Explainer>“Feels like” combines temperature with humidity and wind to estimate how warm or cold it feels on your skin.</Explainer>
          </>
        );

      case 'uv': {
        const level = uvLevel(c.uvIndex);
        return (
          <>
            <Headline value={`${Math.round(c.uvIndex)} · ${level.label}`} note={`${uvProtectionNote(report)} ${level.advice}`} />
            {chart('UV index, next 24 hours', [{ name: 'UV index', color: S1, values: hours.map((h) => h.uvIndex) }], 'bar', (v) => `${Math.round(v)}`, [0, Math.max(11, ...hours.map((h) => Math.ceil(h.uvIndex)))])}
            <Facts items={UV_LEVELS.map((l, i) => [l.label, i === 0 ? '0–2' : l.max === Infinity ? '11+' : `${UV_LEVELS[i - 1].max + 1}–${l.max}`])} />
          </>
        );
      }

      case 'wind':
        return (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <Headline value={formatWind(c.windSpeed, unit)} note={`From the ${compassDirection(c.windDeg)}${c.windGust != null ? ` · gusts ${formatWind(c.windGust, unit)}` : ''}`} />
              <Compass deg={c.windDeg} size={96} />
            </div>
            {chart(
              `Wind speed${hours.some((h) => h.windGust != null) ? ' and gusts' : ''} in ${windUnitLabel(unit)}, next 24 hours`,
              [
                { name: 'Wind', color: S1, values: hours.map((h) => convertWind(h.windSpeed, unit)) },
                ...(hours.some((h) => h.windGust != null)
                  ? [{ name: 'Gusts', color: S2, values: hours.map((h) => convertWind(h.windGust ?? h.windSpeed, unit)) }]
                  : []),
              ],
              'line',
              (v) => `${Math.round(v)}`,
            )}
          </>
        );

      case 'precipitation': {
        const outlook = precipitationOutlook(report.hourly);
        return (
          <>
            <Headline value={formatPrecip(outlook.total)} note={`Expected in the next 24 hours. Highest chance ${Math.round(outlook.maxPop)}%.`} />
            {chart('Chance of precipitation by hour, next 24 hours', [{ name: 'Chance', color: S1, values: hours.map((h) => h.pop) }], 'bar', (v) => `${Math.round(v)}%`, [0, 100])}
          </>
        );
      }

      case 'humidity':
        return (
          <>
            <Headline value={`${Math.round(c.humidity)}%`} note={`${humidityNote(c.humidity)} The dew point is ${formatTemp(dewPoint(c.temp, c.humidity), unit)} right now.`} />
            {chart('Relative humidity, next 24 hours', [{ name: 'Humidity', color: S1, values: hours.map((h) => h.humidity) }], 'line', (v) => `${Math.round(v)}%`, [0, 100])}
            <Explainer>The dew point is the temperature the air would need to cool to for dew to form. Above about 20°C (68°F) it starts to feel muggy.</Explainer>
          </>
        );

      case 'airQuality': {
        const aq = report.airQuality;
        if (!aq) return <p className="text-body text-white/85">Air quality data isn't available for this place.</p>;
        const level = AQI_LEVELS[aq.level];
        const pollutant = (v: number | null) => (v == null ? '—' : `${Math.round(v)} µg/m³`);
        return (
          <>
            <Headline value={`${Math.round(aq.europeanAqi)} · ${level.label}`} note={level.advice} />
            <Facts
              items={[
                ['PM2.5 (fine particles)', pollutant(aq.pm2_5)],
                ['PM10 (coarse particles)', pollutant(aq.pm10)],
                ['Ozone (O₃)', pollutant(aq.o3)],
                ['Nitrogen dioxide (NO₂)', pollutant(aq.no2)],
                ['Sulphur dioxide (SO₂)', pollutant(aq.so2)],
                ['Carbon monoxide (CO)', pollutant(aq.co)],
              ]}
            />
            <Explainer>European Air Quality Index: 0–20 good, 20–40 fair, 40–60 moderate, 60–80 poor, above 80 very poor.</Explainer>
          </>
        );
      }

      case 'visibility':
        return (
          <>
            <Headline value={`${Math.round(convertDistance(c.visibility, unit))} ${distanceUnitLabel(unit)}`} note={visibilityNote(c.visibility)} />
            <Explainer>How far away you can clearly see objects. Fog, haze, smoke and heavy rain reduce it.</Explainer>
          </>
        );

      case 'pressure':
        return (
          <>
            <Headline value={`${c.pressure} hPa`} note={pressureNote(c.pressure)} />
            <Explainer>Sea-level air pressure. Around 1013 hPa is typical; falling pressure often means unsettled weather is on the way.</Explainer>
          </>
        );

      case 'sun': {
        const progress = sunProgress(now, c.sunrise, c.sunset);
        const tomorrow = report.daily[1];
        return (
          <>
            <div className="mb-2 flex justify-center">
              <SunArc progress={progress} width={260} />
            </div>
            <Facts
              items={[
                ['Sunrise', formatClock(c.sunrise, tz)],
                ['Sunset', formatClock(c.sunset, tz)],
                ['Daylight', daylightLength(c.sunrise, c.sunset)],
                ...(tomorrow
                  ? ([
                      ['Tomorrow’s sunrise', formatClock(tomorrow.sunrise, tz)],
                      ['Tomorrow’s sunset', formatClock(tomorrow.sunset, tz)],
                    ] as [string, ReactNode][])
                  : []),
              ]}
            />
          </>
        );
      }
    }
  };

  return (
    <Sheet open={metric != null} onClose={onClose} title={metric ? TITLES[metric] : ''}>
      {metric && renderContent(metric)}
    </Sheet>
  );
};

export default MetricSheet;
