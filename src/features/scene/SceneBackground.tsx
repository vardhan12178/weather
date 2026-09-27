import { useSyncExternalStore } from 'react';
import { Canvas } from '@react-three/fiber';
import WeatherScene from './WeatherScene';
import type { Condition } from '../../types/weather';

const subscribeVisibility = (cb: () => void) => {
  document.addEventListener('visibilitychange', cb);
  return () => document.removeEventListener('visibilitychange', cb);
};
const isPageVisible = () => document.visibilityState === 'visible';

// Loaded lazily from pages/Home.tsx so three.js isn't part of the first download.
const SceneBackground = ({ condition, isDay }: { condition: Condition; isDay: boolean }) => {
  const visible = useSyncExternalStore(subscribeVisibility, isPageVisible);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      // Cap pixel density: 3× phone screens would render 9× the pixels for a blurry backdrop
      dpr={[1, 1.5]}
      // Stop rendering (and draining battery) while the tab is in the background
      frameloop={visible ? 'always' : 'never'}
    >
      <WeatherScene condition={condition} isDay={isDay} />
    </Canvas>
  );
};

export default SceneBackground;
