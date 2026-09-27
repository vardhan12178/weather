import type { CSSProperties } from 'react';
import { SKIES, type Atmosphere, type Sky } from './theme';
import '../../styles/sky.css';

interface WeatherBackgroundProps {
  sky: Sky;
  atmosphere: Atmosphere[];
}

/** Full-screen sky behind the page: colour gradient + lightweight CSS weather. */
const WeatherBackground = ({ sky, atmosphere }: WeatherBackgroundProps) => {
  const { top, bottom } = SKIES[sky];
  const style = { '--sky-top': top, '--sky-bottom': bottom } as CSSProperties;

  return (
    <div className="sky" style={style} aria-hidden="true">
      {atmosphere.includes('sun') && <div className="sky-sun" />}
      {atmosphere.includes('stars') && <div className="sky-stars" />}
      {atmosphere.includes('clouds') && (
        <div className="sky-clouds">
          <span />
          <span />
          <span />
        </div>
      )}
      {atmosphere.includes('fog') && <div className="sky-fog" />}
      {atmosphere.includes('rain') && <div className="sky-rain" />}
      {atmosphere.includes('snow') && <div className="sky-snow" />}
      {atmosphere.includes('storm') && <div className="sky-storm" />}
    </div>
  );
};

export default WeatherBackground;
