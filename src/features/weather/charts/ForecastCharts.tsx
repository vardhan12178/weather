import TemperatureChart from './TemperatureChart';
import PrecipitationChart from './PrecipitationChart';
import type { HourlyForecast, Unit } from '../../../types/weather';

// Loaded on demand (React.lazy in HourlySection): recharts is only
// downloaded when someone switches to the chart view.
const ForecastCharts = ({ hours, timezone, unit }: { hours: HourlyForecast[]; timezone: string; unit: Unit }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
    <TemperatureChart hours={hours} timezone={timezone} unit={unit} />
    <PrecipitationChart hours={hours} timezone={timezone} />
  </div>
);

export default ForecastCharts;
