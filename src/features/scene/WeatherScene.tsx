import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Clouds, Stars, Sky } from '@react-three/drei';
import type { PointLight } from 'three';
import Precipitation from './Precipitation';
import type { Condition } from '../../types/weather';

// Self-hosted cloud sprite (drei's default downloads it from a CDN at runtime,
// which fails offline and when the CDN is blocked).
const CLOUD_TEXTURE = `${import.meta.env.BASE_URL}textures/cloud.png`;

const ThunderFlash = () => {
  const light = useRef<PointLight>(null);
  useFrame(() => {
    if (!light.current) return;
    light.current.intensity =
      Math.random() > 0.98 ? 10 + Math.random() * 20 : Math.max(0, light.current.intensity * 0.9);
  });
  return <pointLight ref={light} position={[0, 10, 0]} distance={100} color="#ffffff" />;
};

interface WeatherSceneProps {
  condition: Condition;
  isDay: boolean;
}

const WeatherScene = ({ condition, isDay }: WeatherSceneProps) => {
  const isStorm = condition === 'Thunderstorm';
  const isRain = condition === 'Rain' || condition === 'Drizzle' || isStorm;
  const isSnow = condition === 'Snow';
  const isFoggy = condition === 'Fog';
  const isCloudy = condition === 'Clouds' || isRain || isSnow;

  return (
    <>
      {isDay ? (
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0}
          azimuth={0.25}
          mieCoefficient={isCloudy ? 0.05 : 0.005}
          mieDirectionalG={isCloudy ? 0.05 : 0.7}
          rayleigh={isCloudy ? 1 : 3}
          turbidity={isCloudy ? 15 : 8}
        />
      ) : (
        <>
          <color attach="background" args={['#0f172a']} />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        </>
      )}

      <ambientLight intensity={isDay ? 0.6 : 0.2} />
      <directionalLight position={[10, 20, 10]} intensity={isDay ? 1.5 : 0.5} />

      {(isFoggy || isRain) && <fog attach="fog" args={[isDay ? '#cbd5e1' : '#1e293b', 5, 25]} />}

      {isStorm && <ThunderFlash />}

      {isCloudy && (
        <Clouds texture={CLOUD_TEXTURE} position={[0, 3, -5]}>
          <Cloud opacity={isDay ? 0.7 : 0.5} speed={0.25} segments={30} />
          <Cloud opacity={isDay ? 0.55 : 0.4} speed={0.18} segments={20} position={[15, -1, 2]} />
          <Cloud opacity={isDay ? 0.45 : 0.3} speed={0.13} segments={15} position={[-12, 1, -3]} />
        </Clouds>
      )}

      {isRain && <Precipitation type="rain" count={1500} />}
      {isSnow && <Precipitation type="snow" count={1200} />}
    </>
  );
};

export default WeatherScene;
