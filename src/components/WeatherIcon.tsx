interface WeatherIconProps {
  /** OpenWeatherMap-style id, e.g. "01d" (see api/wmo.ts) */
  code?: string;
  className?: string;
  size?: number;
}

const WeatherIcon = ({ code, className = '', size = 48 }: WeatherIconProps) => {
  if (!code) return null;

  // Normalize code by stripping the suffix to check base weather type
  const baseCode = code.substring(0, 2);
  const isNight = code.endsWith('n');

  switch (baseCode) {
    case '01': // Clear Sky
      if (isNight) {
        return (
          <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
            <defs>
              <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5f3ff" />
                <stop offset="60%" stopColor="#c7d2fe" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <filter id="moon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path
              d="M36 46a17 17 0 1 1 13-26.5 19 19 0 0 0-13 26.5z"
              fill="url(#moon-grad)"
              filter="url(#moon-glow)"
              className="animate-bounce"
              style={{ animationDuration: '5s', animationTimingFunction: 'ease-in-out' }}
            />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
          <defs>
            <linearGradient id="sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <filter id="sun-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Main glowing sun center - increased radius from 14 to 17 */}
          <circle 
            cx="32" 
            cy="32" 
            r="16.5" 
            fill="url(#sun-grad)" 
            filter="url(#sun-glow)" 
            className="animate-pulse" 
            style={{ animationDuration: '3.5s' }} 
          />
          {/* Sun rays - thicker stroke (4.5 instead of 3.5) and closer alignment */}
          <g 
            stroke="url(#sun-grad)" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            className="origin-center animate-spin" 
            style={{ animationDuration: '28s' }}
          >
            <line x1="32" y1="3" x2="32" y2="9" />
            <line x1="32" y1="55" x2="32" y2="61" />
            <line x1="3" y1="32" x2="9" y2="32" />
            <line x1="55" y1="32" x2="61" y2="32" />
            <line x1="11.5" y1="11.5" x2="16.5" y2="16.5" />
            <line x1="47.5" y1="47.5" x2="52.5" y2="52.5" />
            <line x1="52.5" y1="11.5" x2="47.5" y2="16.5" />
            <line x1="16.5" y1="47.5" x2="11.5" y2="52.5" />
          </g>
        </svg>
      );

    case '02': // Few Clouds
      if (isNight) {
        return (
          <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
            <defs>
              <linearGradient id="moon-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5f3ff" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="cloud-grad-n" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
                <stop offset="100%" stopColor="rgba(148, 163, 184, 0.3)" />
              </linearGradient>
            </defs>
            {/* Larger Moon */}
            <path 
              d="M38 34a12 12 0 1 1 9.5-19.5 14 14 0 0 0-9.5 19.5z" 
              fill="url(#moon-grad-2)" 
            />
            {/* Front Cloud - increased scale and visibility */}
            <path
              d="M16 48h30a9 9 0 0 0 1.8-17.8 10 10 0 0 0-18.4-2.8A7.5 7.5 0 0 0 16 48z"
              fill="url(#cloud-grad-n)"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              className="animate-bounce"
              style={{ animationDuration: '6s', animationTimingFunction: 'ease-in-out' }}
            />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
          <defs>
            <linearGradient id="sun-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="cloud-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset="100%" stopColor="rgba(186, 215, 240, 0.8)" />
            </linearGradient>
          </defs>
          {/* Larger Sun behind clouds */}
          <circle 
            cx="38" 
            cy="24" 
            r="12.5" 
            fill="url(#sun-grad-2)" 
            className="animate-pulse" 
            style={{ animationDuration: '4s' }} 
          />
          {/* Bold Cloud */}
          <path
            d="M16 48h30a9 9 0 0 0 1.8-17.8 10 10 0 0 0-18.4-2.8A7.5 7.5 0 0 0 16 48z"
            fill="url(#cloud-grad)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            className="animate-bounce"
            style={{ animationDuration: '5s', animationTimingFunction: 'ease-in-out' }}
          />
        </svg>
      );

    case '03': // Scattered Clouds
    case '04': // Broken / Overcast Clouds
      return (
        <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
          <defs>
            <linearGradient id="cloud-back" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(148, 163, 184, 0.6)" />
              <stop offset="100%" stopColor="rgba(71, 85, 105, 0.45)" />
            </linearGradient>
            <linearGradient id="cloud-front" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset="100%" stopColor="rgba(176, 208, 235, 0.8)" />
            </linearGradient>
          </defs>
          {/* Larger double clouds to fill space */}
          <path
            d="M12 40h24a8 8 0 0 0 1.6-15.8 9 9 0 0 0-16.8-2.4A6.5 6.5 0 0 0 12 40z"
            fill="url(#cloud-back)"
            className="animate-pulse"
            style={{ animationDuration: '7s' }}
          />
          <path
            d="M20 48h28a10 10 0 0 0 2-19.8 11 11 0 0 0-20.4-3.2A8 8 0 0 0 20 48z"
            fill="url(#cloud-front)"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
            className="animate-bounce"
            style={{ animationDuration: '4.5s', animationTimingFunction: 'ease-in-out' }}
          />
        </svg>
      );

    case '09': // Shower Rain
    case '10': // Rain
      return (
        <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
          <defs>
            <linearGradient id="cloud-rain-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(224, 236, 248, 0.95)" />
              <stop offset="100%" stopColor="rgba(120, 138, 158, 0.75)" />
            </linearGradient>
          </defs>
          {/* Richer Cloud */}
          <path
            d="M14 42h32a10 10 0 0 0 2-19.8 11 11 0 0 0-20.4-3.2A8.5 8.5 0 0 0 14 42z"
            fill="url(#cloud-rain-grad)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />
          {/* Thicker, longer rain lines for high readability */}
          <g 
            stroke="#0ea5e9" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            className="animate-pulse" 
            style={{ animationDuration: '1.1s' }}
          >
            <line x1="22" y1="46" x2="19" y2="54" />
            <line x1="32" y1="47" x2="29" y2="55" />
            <line x1="42" y1="46" x2="39" y2="54" />
          </g>
        </svg>
      );

    case '11': // Thunderstorm
      return (
        <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
          <defs>
            <linearGradient id="cloud-storm-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(71, 85, 105, 0.95)" />
              <stop offset="100%" stopColor="rgba(30, 41, 59, 0.85)" />
            </linearGradient>
            <linearGradient id="lightning-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <filter id="lightning-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Darker, ominous cloud */}
          <path
            d="M14 42h32a10 10 0 0 0 2-19.8 11 11 0 0 0-20.4-3.2A8.5 8.5 0 0 0 14 42z"
            fill="url(#cloud-storm-grad)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
          {/* Bold glowing lightning bolt */}
          <polygon
            points="31,40 39,40 33,48 40,48 29,61 33,47 28,47"
            fill="url(#lightning-grad)"
            filter="url(#lightning-glow)"
            className="animate-pulse"
            style={{ animationDuration: '0.7s' }}
          />
        </svg>
      );

    case '13': // Snow
      return (
        <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
          <defs>
            <linearGradient id="cloud-snow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(248, 250, 252, 0.98)" />
              <stop offset="100%" stopColor="rgba(186, 200, 218, 0.85)" />
            </linearGradient>
          </defs>
          <path
            d="M14 42h32a10 10 0 0 0 2-19.8 11 11 0 0 0-20.4-3.2A8.5 8.5 0 0 0 14 42z"
            fill="url(#cloud-snow-grad)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />
          {/* Larger snowflakes */}
          <g fill="#7dd3fc" className="animate-spin origin-center" style={{ animationDuration: '10s' }}>
            <circle cx="21" cy="48" r="2.5" />
            <circle cx="32" cy="53" r="2.0" />
            <circle cx="43" cy="48" r="2.5" />
          </g>
        </svg>
      );

    case '50': // Mist / Fog / Haze
      return (
        <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
          <g 
            stroke="#94a3b8" 
            strokeWidth="4" 
            strokeLinecap="round" 
            className="animate-pulse" 
            style={{ animationDuration: '2.5s' }}
          >
            <line x1="12" y1="22" x2="52" y2="22" />
            <line x1="20" y1="30" x2="44" y2="30" />
            <line x1="10" y1="38" x2="54" y2="38" />
            <line x1="24" y1="46" x2="40" y2="46" />
          </g>
        </svg>
      );

    default:
      // Vibrant custom fallback instead of basic gray circle
      return (
        <svg viewBox="0 0 64 64" className={className} width={size} height={size}>
          <defs>
            <linearGradient id="def-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="16" fill="url(#def-grad)" className="animate-pulse" />
        </svg>
      );
  }
};

export default WeatherIcon;
