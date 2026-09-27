import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, type Points } from 'three';

// Soft round sprite drawn in code, so particles render as droplets/flakes
// instead of hard squares (and nothing has to be downloaded).
let dotTexture: CanvasTexture | undefined;
const getDotTexture = () => {
  if (dotTexture) return dotTexture;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  dotTexture = new CanvasTexture(canvas);
  return dotTexture;
};

const CONFIG = {
  rain: { speed: 0.8, size: 0.08, color: '#aabbee', opacity: 0.6, wobble: false },
  snow: { speed: 0.05, size: 0.15, color: '#ffffff', opacity: 0.8, wobble: true },
} as const;

const createParticles = (count: number) => {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    velocities[i] = Math.random() * 0.2 + 0.1;
  }
  return { positions, velocities };
};

interface PrecipitationProps {
  type: keyof typeof CONFIG;
  count?: number;
}

const Precipitation = ({ type, count = 1000 }: PrecipitationProps) => {
  const mesh = useRef<Points>(null);
  const config = CONFIG[type];

  // Random start positions and per-particle speeds, generated once per count
  const { positions, velocities } = useMemo(() => createParticles(count), [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const arr = mesh.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= config.speed * velocities[i];
      if (arr[i * 3 + 1] < -10) {
        arr[i * 3 + 1] = 10;
        arr[i * 3] = (Math.random() - 0.5) * 20;
      }
      if (config.wobble) arr[i * 3] += Math.sin(t + i) * 0.002;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={config.size * 1.6}
        map={getDotTexture()}
        color={config.color}
        transparent
        opacity={config.opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default Precipitation;
