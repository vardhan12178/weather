import { useMemo, type Ref } from 'react';
import Hero from './Hero';
import AlertBanner from './AlertBanner';
import HourlyCard from './HourlyCard';
import DailyCard from './DailyCard';
import MetricTiles from './tiles/MetricTiles';
import { getAlert } from './insights/rules';
import { getHourlySummary } from './insights/summary';
import type { MetricId } from './metrics';
import Footer from '../../components/Footer';
import type { Place, Unit, WeatherReport } from '../../types/weather';

interface WeatherScreenProps {
  report: WeatherReport;
  place: Place;
  unit: Unit;
  status: string;
  heroRef: Ref<HTMLElement>;
  onOpenMetric: (id: MetricId) => void;
}

/**
 * Phones: one column in reading order (now → next hours → week → details).
 * Desktop: the week sits in a sticky side column next to everything else.
 */
const WeatherScreen = ({ report, place, unit, status, heroRef, onOpenMetric }: WeatherScreenProps) => {
  const ctx = useMemo(() => ({ unit, timezone: report.timezone, country: place.country }), [unit, report.timezone, place.country]);
  const current = report.current;
  const alert = useMemo(() => getAlert(current, ctx), [current, ctx]);
  const summary = useMemo(() => getHourlySummary(report, ctx), [report, ctx]);
  // Re-mount the alert per place/update so a dismissal doesn't carry over
  const alertKey = `${report.lat},${report.lon},${report.current.time}`;

  return (
    <div className="stagger grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-x-6">
      <div className="lg:col-start-1">
        <Hero ref={heroRef} current={report.current} unit={unit} status={status} />
      </div>

      {alert && (
        <div className="lg:col-start-1">
          <AlertBanner key={alertKey} alert={alert} />
        </div>
      )}

      <div className="lg:col-start-1">
        <HourlyCard report={report} unit={unit} summary={summary} />
      </div>

      <div className="lg:sticky lg:top-20 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mt-8">
        <DailyCard days={report.daily} currentTemp={report.current.temp} timezone={report.timezone} unit={unit} />
      </div>

      <div className="lg:col-start-1">
        <MetricTiles report={report} unit={unit} onOpen={onOpenMetric} />
      </div>

      <div className="lg:col-span-2">
        <Footer />
      </div>
    </div>
  );
};

export default WeatherScreen;
