import type { ReactNode } from 'react';
import { Droplet, Droplets, Eye, Gauge, Leaf, Sun, Sunrise, Sunset, Thermometer, Umbrella, Wind, type LucideIcon } from 'lucide-react';
import { Compass, Meter, SunArc } from './visuals';
import { UV_GRADIENT, aqiGradient } from '../theme';
import {
  AQI_LEVELS,
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
import { compassDirection, convertDistance, convertWind, dewPoint, distanceUnitLabel, formatTemp, formatWind, windUnitLabel } from '../../../lib/units';
import type { Unit, WeatherReport } from '../../../types/weather';

interface TileProps {
  id: MetricId;
  icon: LucideIcon;
  title: string;
  value: ReactNode;
  note: string;
  onOpen: (id: MetricId) => void;
  children?: ReactNode;
  className?: string;
}

const Tile = ({ id, icon: Icon, title, value, note, onOpen, children, className = '' }: TileProps) => (
  <button
    type="button"
    onClick={() => onOpen(id)}
    aria-haspopup="dialog"
    className={`glass flex min-h-40 flex-col p-4 text-left transition hover:bg-[rgb(8_20_45/0.42)] active:scale-[0.98] ${className}`}
  >
    <span className="flex items-center gap-1.5 text-footnote font-semibold text-white/85">
      <Icon size={14} aria-hidden="true" />
      {title}
    </span>
    <span className="mt-2 text-large font-medium">{value}</span>
    {children}
    <span className="mt-auto pt-3 text-footnote text-white/85">{note}</span>
  </button>
);

const UnitLabel = ({ children }: { children: ReactNode }) => <span className="ml-1 text-headline font-medium text-white/85">{children}</span>;

interface MetricTilesProps {
  report: WeatherReport;
  unit: Unit;
  onOpen: (id: MetricId) => void;
}

const MetricTiles = ({ report, unit, onOpen }: MetricTilesProps) => {
  const now = useNow();
  const c = report.current;
  const uv = uvLevel(c.uvIndex);
  const precip = precipitationOutlook(report.hourly);
  const sun = sunProgress(now, c.sunrise, c.sunset);
  const nextSunEvent = sun == null ? { label: 'Sunrise', time: report.daily[1]?.sunrise ?? c.sunrise } : { label: 'Sunset', time: c.sunset };

  return (
    <div className="grid grid-flow-row-dense grid-cols-2 gap-3 md:grid-cols-3">
      <Tile id="uv" icon={Sun} title="UV index" value={<>{Math.round(c.uvIndex)}<UnitLabel>{uv.label}</UnitLabel></>} note={uvProtectionNote(report)} onOpen={onOpen}>
        <Meter pct={(Math.min(c.uvIndex, 11) / 11) * 100} gradient={UV_GRADIENT} />
      </Tile>

      <Tile
        id="sun"
        icon={nextSunEvent.label === 'Sunrise' ? Sunrise : Sunset}
        title={nextSunEvent.label}
        value={<span className="text-title font-semibold tnum">{formatClock(nextSunEvent.time, report.timezone)}</span>}
        note={sun == null ? `Sunset was ${formatClock(c.sunset, report.timezone)}` : `Sunrise was ${formatClock(c.sunrise, report.timezone)}`}
        onOpen={onOpen}
        className="col-span-2 md:col-span-1"
      >
        <div className="mt-2 flex justify-center">
          <SunArc progress={sun} width={132} />
        </div>
      </Tile>

      <Tile
        id="wind"
        icon={Wind}
        title="Wind"
        value={<>{Math.round(convertWind(c.windSpeed, unit))}<UnitLabel>{windUnitLabel(unit)}</UnitLabel></>}
        note={c.windGust != null ? `Gusts ${formatWind(c.windGust, unit)} · from ${compassDirection(c.windDeg)}` : `From the ${compassDirection(c.windDeg)}`}
        onOpen={onOpen}
      >
        <div className="mt-1 flex justify-center">
          <Compass deg={c.windDeg} size={72} />
        </div>
      </Tile>

      <Tile
        id="precipitation"
        icon={Umbrella}
        title="Precipitation"
        value={formatPrecip(precip.total)}
        note={`Expected in the next 24 h · up to ${Math.round(precip.maxPop)}% chance`}
        onOpen={onOpen}
      />

      <Tile id="feelsLike" icon={Thermometer} title="Feels like" value={formatTemp(c.feelsLike, unit)} note={feelsLikeNote(c)} onOpen={onOpen} />

      <Tile
        id="humidity"
        icon={Droplets}
        title="Humidity"
        value={`${Math.round(c.humidity)}%`}
        note={`${humidityNote(c.humidity)} Dew point ${formatTemp(dewPoint(c.temp, c.humidity), unit)}.`}
        onOpen={onOpen}
      />

      {report.airQuality && (
        <Tile
          id="airQuality"
          icon={Leaf}
          title="Air quality"
          value={<>{Math.round(report.airQuality.europeanAqi)}<UnitLabel>{AQI_LEVELS[report.airQuality.level].label}</UnitLabel></>}
          note="European AQI"
          onOpen={onOpen}
        >
          <Meter pct={Math.min(report.airQuality.europeanAqi, 100)} gradient={aqiGradient()} />
        </Tile>
      )}

      <Tile
        id="visibility"
        icon={Eye}
        title="Visibility"
        value={<>{Math.round(convertDistance(c.visibility, unit))}<UnitLabel>{distanceUnitLabel(unit)}</UnitLabel></>}
        note={visibilityNote(c.visibility)}
        onOpen={onOpen}
      />

      <Tile id="pressure" icon={Gauge} title="Pressure" value={<>{c.pressure}<UnitLabel>hPa</UnitLabel></>} note={pressureNote(c.pressure)} onOpen={onOpen} />

      {!report.airQuality && (
        <Tile id="humidity" icon={Droplet} title="Dew point" value={formatTemp(dewPoint(c.temp, c.humidity), unit)} note="The temperature at which dew forms." onOpen={onOpen} />
      )}
    </div>
  );
};

export default MetricTiles;
