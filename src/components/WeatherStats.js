import React from 'react';
import { Wind, Droplet, Eye, Activity, Sunrise, Sunset, Thermometer, Sun } from 'react-feather';

// ─── UV Index details helper ─────────────────────────────────────────────────
const getUVDetails = (uv) => {
  if (uv == null) return { text: 'N/A', color: 'text-slate-500', pct: 0, desc: 'No UV data available.' };
  const val = Math.round(uv);
  const pct = Math.min(100, (val / 12) * 100);
  if (val <= 2)  return { text: `${val} Low`,       color: 'text-emerald-500', pct, desc: 'Safe to stay outdoors.' };
  if (val <= 5)  return { text: `${val} Moderate`,  color: 'text-yellow-500', pct, desc: 'Wear sunscreen, seek shade.' };
  if (val <= 7)  return { text: `${val} High`,      color: 'text-orange-500', pct, desc: 'Protection needed. Stay in shade.' };
  if (val <= 10) return { text: `${val} Very High`, color: 'text-red-500', pct, desc: 'Extra protection required.' };
  return                 { text: `${val} Extreme`,    color: 'text-purple-500', pct, desc: 'Avoid outside work.' };
};

// ─── Wind direction helper ───────────────────────────────────────────────────
const getWindDirection = (deg) => {
  if (deg === undefined || deg === null) return { label: 'N/A', abbr: '--' };
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return { label: dirs[index], abbr: dirs[index], deg };
};

// ─── Borderless Metric Widget Cell ───────────────────────────────────────────
const MetricWidget = ({ icon: Icon, title, value, unitLabel, description, children }) => (
  <div className="flex flex-col justify-between min-h-[125px] p-3.5 sm:p-4 rounded-[20px] hover:bg-slate-950/[0.04] dark:hover:bg-white/5 transition-all duration-300">
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {Icon && <Icon size={12} className="opacity-70" />}
      <span>{title}</span>
    </div>

    <div className="my-2 flex-grow flex flex-col justify-center">
      {children ? children : (
        <div className="flex items-baseline">
          <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white tnum">{value}</span>
          {unitLabel && <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-0.5">{unitLabel}</span>}
        </div>
      )}
    </div>

    {description && (
      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-normal">
        {description}
      </p>
    )}
  </div>
);

// ─── Main WeatherStats Component ─────────────────────────────────────────────
const WeatherStats = ({ weatherData, unit, mainCardClass, textColor, textSubColor }) => {
  if (!weatherData) return null;

  const { main, wind, visibility, sys, timezone, uvIndex } = weatherData;
  const { humidity, pressure, temp, feels_like } = main;
  const { speed, deg: windDeg, gust } = wind;
  const { sunrise, sunset } = sys;

  // Dew point calculation (Magnus formula)
  const calculateDewPoint = (t, h) => {
    const a = 17.27, b = 237.7;
    const alpha = ((a * t) / (b + t)) + Math.log(h / 100);
    return (b * alpha) / (a - alpha);
  };
  const dewPoint = calculateDewPoint(temp, humidity);

  // Formatting local time helper
  const formatTime = (timestamp) => {
    const localTime = new Date((timestamp + timezone) * 1000);
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' });
  };

  // Sun Arc progress calculation
  const now = Math.floor(Date.now() / 1000);
  const isDay = now >= sunrise && now <= sunset;
  let sunProgress = 0;
  if (isDay) {
    sunProgress = (now - sunrise) / (sunset - sunrise);
  } else {
    sunProgress = now > sunset ? 1 : 0;
  }
  sunProgress = Math.max(0, Math.min(1, sunProgress));

  // Visual Sun Arc coordinates
  const sunAngle = 180 - sunProgress * 180;
  const sunRad = (sunAngle * Math.PI) / 180;
  const sunX = 90 + 80 * Math.cos(sunRad);
  const sunY = 90 - 80 * Math.sin(sunRad);

  const uvDetails = getUVDetails(uvIndex);
  const windDir = getWindDirection(windDeg);

  // Dynamic descriptions
  const getFeelsLikeDesc = () => {
    const diff = feels_like - temp;
    if (Math.abs(diff) < 1.5) return 'Feels similar to the actual temperature.';
    if (diff > 0) return `Feels ${Math.round(diff)}° warmer due to humidity.`;
    return `Feels ${Math.round(Math.abs(diff))}° cooler due to wind/moisture.`;
  };

  const getHumidityDesc = () => {
    if (humidity > 70) return 'Muggy conditions. Moisture is high.';
    if (humidity < 35) return 'Dry air. Moisturize your skin.';
    return 'Comfortable range of air moisture.';
  };

  const getVisibilityDesc = () => {
    const visKm = visibility / 1000;
    if (visKm >= 9.5) return 'Excellent clarity. Visible to the horizon.';
    if (visKm >= 5) return 'Good visibility. Slight haze.';
    return 'Reduced visibility. Drive with caution.';
  };

  const getPressureDesc = () => {
    if (pressure > 1018) return 'High pressure. Stable and clear.';
    if (pressure < 1008) return 'Low pressure. Rain or clouds likely.';
    return 'Typical atmospheric pressure levels.';
  };

  // Feels Like bidirectional offset slider (-10°C to +10°C offset range)
  const tempDiff = feels_like - temp;
  const feelsLikePct = Math.max(0, Math.min(100, 50 + (tempDiff / 10) * 50));

  // Visibility progress percentage
  const visKm = visibility / 1000;
  const visPct = Math.max(0, Math.min(100, (visKm / 10) * 100));

  // Pressure progress percentage (relative to 980hPa - 1040hPa range)
  const pressPct = Math.max(0, Math.min(100, ((pressure - 980) / 60) * 100));

  return (
    <div className={`p-4 sm:p-7 md:p-8 ${mainCardClass} w-full flex flex-col gap-6`}>
      {/* Card Header Title */}
      <h3 className={`${textColor} font-bold text-xs uppercase tracking-wider opacity-70`}>
        Weather details
      </h3>

      {/* Grid structure - borderless grid cells inside the card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* 1. Wind Widget with Compass */}
        <MetricWidget
          icon={Wind}
          title="Wind"
          description={gust ? `Gusts up to ${Math.round(gust)} ${unit === 'metric' ? 'm/s' : 'mph'}.` : `Blowing from the ${windDir.label}.`}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 shrink-0">
              <svg viewBox="0 0 40 40" className="w-full h-full text-slate-800 dark:text-slate-200">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
                <line x1="20" y1="2" x2="20" y2="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="20" y1="38" x2="20" y2="35" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="2" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="38" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                
                {/* Wind Compass needle */}
                <g transform={`rotate(${windDeg || 0}, 20, 20)`}>
                  <polygon points="20,4 16,16 20,13 24,16" fill="#2f6bed" />
                  <polygon points="20,36 16,24 20,27 24,24" fill="currentColor" opacity="0.3" />
                </g>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-brand-600 dark:text-brand-300 mt-0.5">{windDir.abbr}</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-semibold text-slate-900 dark:text-white tnum">{Math.round(speed)}</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-0.5">{unit === 'metric' ? 'm/s' : 'mph'}</span>
              </div>
            </div>
          </div>
        </MetricWidget>

        {/* 2. Humidity Widget */}
        <MetricWidget
          icon={Droplet}
          title="Humidity"
          description={getHumidityDesc()}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white tnum">{humidity}</span>
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-0.5">%</span>
            </div>
            {/* Smooth level slider with indicator dot */}
            <div className="relative w-full h-1.5 bg-slate-950/10 dark:bg-white/10 rounded-full mt-1.5">
              <div
                className="absolute h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
                style={{ width: `${humidity}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-brand-500 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-10"
                style={{ left: `calc(${humidity}% - 6px)` }}
              />
            </div>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1">
              Dew point is {Math.round(dewPoint)}° right now.
            </p>
          </div>
        </MetricWidget>

        {/* 3. UV Index Widget */}
        <MetricWidget
          icon={Sun}
          title="UV Index"
          description={uvDetails.desc}
        >
          <div className="flex flex-col gap-1.5">
            <span className={`text-2xl font-semibold ${uvDetails.color}`}>{uvDetails.text}</span>
            {/* Color spectrum slider */}
            <div className="relative w-full h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 via-orange-500 via-red-500 to-purple-600 mt-1.5">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-emerald-500 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-10"
                style={{ left: `calc(${uvDetails.pct}% - 6px)` }}
              />
            </div>
          </div>
        </MetricWidget>

        {/* 4. Feels Like Widget */}
        <MetricWidget
          icon={Thermometer}
          title="Feels Like"
          description={getFeelsLikeDesc()}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white tnum">{Math.round(feels_like)}°</span>
            </div>
            {/* Bidirectional offset slider with indicator dot */}
            <div className="relative w-full h-1.5 bg-slate-950/10 dark:bg-white/10 rounded-full mt-1.5">
              <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-400/50" />
              <div
                className={`absolute h-full rounded-full ${tempDiff > 0 ? 'bg-orange-500' : tempDiff < 0 ? 'bg-sky-400' : 'bg-slate-400'}`}
                style={{
                  left: tempDiff >= 0 ? '50%' : `${feelsLikePct}%`,
                  width: `${Math.abs(tempDiff / 10) * 50}%`
                }}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 ${tempDiff > 0 ? 'border-orange-500' : tempDiff < 0 ? 'border-sky-400' : 'border-slate-400'} rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-10`}
                style={{ left: `calc(${feelsLikePct}% - 6px)` }}
              />
            </div>
          </div>
        </MetricWidget>

        {/* 5. Visibility Widget */}
        <MetricWidget
          icon={Eye}
          title="Visibility"
          description={getVisibilityDesc()}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white tnum">{Math.round(visKm)}</span>
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-0.5">km</span>
            </div>
            {/* Visibility progress slider with indicator dot */}
            <div className="relative w-full h-1.5 bg-slate-950/10 dark:bg-white/10 rounded-full mt-1.5">
              <div
                className="absolute h-full bg-gradient-to-r from-brand-300 to-brand-500 rounded-full"
                style={{ width: `${visPct}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-brand-500 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-10"
                style={{ left: `calc(${visPct}% - 6px)` }}
              />
            </div>
          </div>
        </MetricWidget>

        {/* 6. Pressure Widget */}
        <MetricWidget
          icon={Activity}
          title="Pressure"
          description={getPressureDesc()}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white tnum">{pressure}</span>
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-0.5">hPa</span>
            </div>
            {/* Sea-level pressure slider with indicator dot */}
            <div className="relative w-full h-1.5 bg-slate-950/10 dark:bg-white/10 rounded-full mt-1.5">
              <div className="absolute left-[55%] -translate-x-1/2 w-0.5 h-full bg-slate-400/40" />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-brand-500 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-10"
                style={{ left: `calc(${pressPct}% - 6px)` }}
              />
            </div>
          </div>
        </MetricWidget>

      </div>

      {/* Divider line */}
      <div className="h-[1px] bg-slate-950/5 dark:bg-white/5 my-2" />

      {/* ── Sunrise & Sunset Sun Arc Section ── */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
              <Sunrise size={12} />
              <span>Sunrise</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 tnum">{formatTime(sunrise)}</span>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
              <span>Sunset</span>
              <Sunset size={12} />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 tnum">{formatTime(sunset)}</span>
          </div>
        </div>

        {/* Curved sun/moon track arc */}
        <div className="relative h-24 w-full mt-2 flex justify-center items-end overflow-visible select-none">
          <svg className="w-full h-full md:w-2/3 overflow-visible" viewBox="0 0 180 100" preserveAspectRatio="xMidYMax meet">
            {/* Grid dotted path */}
            <path
              d="M 10,90 A 80,80 0 0,1 170,90"
              fill="none"
              stroke="currentColor"
              className="text-slate-950/15 dark:text-white/10"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Solid progressive gradient path */}
            <path
              d="M 10,90 A 80,80 0 0,1 170,90"
              fill="none"
              stroke={isDay ? "url(#sunArcGrad)" : "url(#moonArcGrad)"}
              strokeWidth="3.5"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 * (1 - sunProgress)}
              strokeLinecap="round"
            />
            
            {/* Glowing Sun or Moon marker */}
            <g transform={`translate(${sunX}, ${sunY})`}>
              {isDay ? (
                <>
                  <circle r="7.5" fill="url(#sunMarkerColor)" />
                  <circle r="14" fill="rgba(251,191,36,0.25)" className="animate-ping" style={{ animationDuration: '3s' }} />
                </>
              ) : (
                <>
                  <path d="M -3 3 a 4.5 4.5 0 1 1 3 -7.5 a 5.5 5.5 0 0 0 -3 7.5" fill="url(#moonMarkerColor)" />
                  <circle r="10" fill="rgba(129,140,248,0.2)" className="animate-ping" style={{ animationDuration: '3.5s' }} />
                </>
              )}
            </g>

            <defs>
              <linearGradient id="sunArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="moonArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#312e81" />
                <stop offset="50%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <radialGradient id="sunMarkerColor" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="100%" stopColor="#fbbf24" />
              </radialGradient>
              <linearGradient id="moonMarkerColor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Position indicators */}
        <div className="w-full flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-2 border-t border-slate-950/5 dark:border-white/5 pt-2">
          <span>Horizon</span>
          <span>{isDay ? 'Daytime' : 'Nighttime'}</span>
          <span>Horizon</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherStats;
