import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Stars, Sky } from '@react-three/drei';
import Precipitation from './Precipitation';

const ThunderFlash = () => {
  const light = useRef();
  useFrame(() => {
    if (Math.random() > 0.98) {
      light.current.intensity = 10 + Math.random() * 20;
    } else {
      light.current.intensity = Math.max(0, light.current.intensity * 0.9);
    }
  });
  return <pointLight ref={light} position={[0, 10, 0]} distance={100} color="#ffffff" />;
};

const WeatherScene = ({ condition, isDay }) => {
  // 1. Normalize the condition string
  const main = condition || 'Clear';

  // 2. Define Groups based on OpenWeatherMap API
  const isRain = ['Rain', 'Drizzle', 'Thunderstorm'].includes(main);
  const isSnow = ['Snow'].includes(main);
  const isStorm = ['Thunderstorm'].includes(main);
  const isCloudy = ['Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow'].includes(main);

  // Atmospheric Conditions
  const isFoggy = ['Mist', 'Smoke', 'Fog', 'Haze'].includes(main);
  const isDusty = ['Dust', 'Sand', 'Ash'].includes(main);
  const isTornado = ['Tornado', 'Squall'].includes(main);

  return (
    <>
      {/* BACKGROUND: Sky or Stars */}
      {isDay ? (
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]} // High Noon default
          inclination={0}
          azimuth={0.25}
          mieCoefficient={isCloudy ? 0.05 : 0.005} // Muddier sky if cloudy
          mieDirectionalG={isCloudy ? 0.05 : 0.7}
          rayleigh={isCloudy ? 1 : 3} // Lower Scattering for clearer sky
          turbidity={isCloudy ? 15 : 8} // Higher haze if cloudy
        />
      ) : (
        <>
          <color attach="background" args={['#0f172a']} /> {/* Dark Blue/Slate */}
          <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
        </>
      )}

      {/* AMBIENCE & LIGHTING */}
      <ambientLight intensity={isDay ? 0.6 : 0.2} />
      <directionalLight position={[10, 20, 10]} intensity={isDay ? 1.5 : 0.5} castShadow />

      {/* Fog for Depth (Only if foggy or storming to hide horizon) */}
      {(isFoggy || isStorm || isRain) && (
        <fog attach="fog" args={[isDay ? '#cbd5e1' : '#1e293b', 5, 25]} />
      )}

      {isStorm && <ThunderFlash />}

      {/* CLOUDS - More prominent */}
      {isCloudy && (
        <group position={[0, 3, -5]}>
          <Cloud opacity={isDay ? 0.9 : 0.6} speed={0.3} width={30} depth={8} segments={30} />
          <Cloud opacity={isDay ? 0.7 : 0.5} speed={0.2} width={20} depth={6} segments={20} position={[15, -1, 2]} />
          <Cloud opacity={isDay ? 0.6 : 0.4} speed={0.15} width={15} depth={4} segments={15} position={[-12, 1, -3]} />
        </group>
      )}

      {/* --- PRECIPITATION MAPPING --- Enhanced counts */}
      {(isRain || isStorm) && <Precipitation type="Rain" count={3000} />}
      {isSnow && <Precipitation type="Snow" count={2000} />}
      {isDusty && <Precipitation type="Dust" count={1500} />}
      {isFoggy && <Precipitation type="Smoke" count={1000} />}
      {isTornado && <Precipitation type="Tornado" count={3000} />}

    </>
  );
};

export default WeatherScene;