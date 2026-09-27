import { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import CurrentConditions from './CurrentConditions';
import AirQualityBar from './AirQualityBar';
import HourlySection from './HourlySection';
import DailyForecast from './DailyForecast';
import WeatherStats from './stats/WeatherStats';
import WeatherAlerts from './insights/WeatherAlerts';
import WeatherRecommendations from './insights/WeatherRecommendations';
import { getAlert, getRecommendation } from './insights/rules';
import FavoritesList from '../favorites/FavoritesList';
import type { SavedPlace } from '../favorites/useFavorites';
import Footer from '../../components/Footer';
import { cardClass } from '../../components/ui';
import type { Place, Unit, WeatherReport } from '../../types/weather';

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } },
};

export const DashboardSkeleton = () => (
  <div className="w-full max-w-4xl mt-8" aria-busy="true" aria-live="polite">
    <div className="mb-8 inline-flex items-center gap-3 px-5 py-3 rounded-full md:bg-white/30 backdrop-blur-xl border border-white/20">
      <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold tracking-wide">Fetching live weather data</span>
    </div>
    <div className="w-full animate-pulse flex flex-col gap-6">
      <div className="w-full h-128 rounded-[2.5rem] bg-white/35" />
      <div className="w-full h-72 rounded-[2.5rem] bg-white/25" />
    </div>
  </div>
);

interface WeatherDashboardProps {
  report: WeatherReport;
  place: Place;
  unit: Unit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  favorites: SavedPlace[];
  isFavorite: boolean;
  canAddFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectFavorite: (place: SavedPlace) => void;
  onRemoveFavorite: (place: SavedPlace) => void;
}

const WeatherDashboard = ({
  report,
  place,
  unit,
  onToggleUnit,
  onRefresh,
  refreshing,
  favorites,
  isFavorite,
  canAddFavorite,
  onToggleFavorite,
  onSelectFavorite,
  onRemoveFavorite,
}: WeatherDashboardProps) => {
  const { current, timezone } = report;
  const ctx = useMemo(() => ({ unit, timezone, country: place.country }), [unit, timezone, place.country]);
  const alert = useMemo(() => getAlert(current, ctx), [current, ctx]);
  const recommendation = useMemo(() => getRecommendation(current, ctx), [current, ctx]);
  // Re-mount insights per place/update so a dismissal doesn't carry over
  const insightKey = `${report.lat},${report.lon},${current.time}`;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-4xl mt-4 sm:mt-6 flex flex-col gap-6">
      {favorites.length > 0 && (
        <motion.div variants={item} className={`p-4 sm:p-5 overflow-hidden ${cardClass}`}>
          <FavoritesList favorites={favorites} unit={unit} onSelect={onSelectFavorite} onRemove={onRemoveFavorite} />
        </motion.div>
      )}

      <motion.div variants={item} className={`p-4 sm:p-7 md:p-8 ${cardClass}`}>
        <CurrentConditions
          report={report}
          place={place}
          unit={unit}
          onToggleUnit={onToggleUnit}
          onRefresh={onRefresh}
          refreshing={refreshing}
          isFavorite={isFavorite}
          canAddFavorite={canAddFavorite}
          onToggleFavorite={onToggleFavorite}
        />

        <div className="flex flex-col gap-3 w-full mb-6">
          {alert && <WeatherAlerts key={`alert-${insightKey}`} alert={alert} />}
          <WeatherRecommendations key={`rec-${insightKey}`} recommendation={recommendation} />
        </div>

        {report.airQuality && (
          <div className="mb-6">
            <AirQualityBar airQuality={report.airQuality} />
          </div>
        )}

        <div className="h-px bg-slate-950/5 dark:bg-white/5 my-2" />

        <div className="mt-6">
          <HourlySection hours={report.hourly} timezone={timezone} unit={unit} />
        </div>

        <div className="h-px bg-slate-950/5 dark:bg-white/5 my-6" />

        <DailyForecast days={report.daily} currentTemp={current.temp} timezone={timezone} unit={unit} />
      </motion.div>

      <motion.div variants={item}>
        <WeatherStats current={current} timezone={timezone} unit={unit} />
      </motion.div>

      <div className="w-full pt-4">
        <Footer />
      </div>
    </motion.div>
  );
};

export default WeatherDashboard;
