import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';


const Precipitation = ({ type, count = 1000 }) => {
  const mesh = useRef();

  // Configuration based on weather type
  const config = useMemo(() => {
    switch (type) {
      case 'Snow':
        return { speed: 0.05, size: 0.15, color: '#ffffff', opacity: 0.8, wobble: true };
      case 'Rain':
      case 'Drizzle':
      case 'Thunderstorm':
        return { speed: 0.8, size: 0.08, color: '#aabbee', opacity: 0.6, wobble: false };
      case 'Dust':
      case 'Sand':
      case 'Ash':
        return { speed: 0.01, size: 0.05, color: '#dcb164', opacity: 0.4, wobble: true }; // Floating dust
      default:
        return { speed: 0, size: 0, color: '#000', opacity: 0 };
    }
  }, [type]);

  // Generate random positions once
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;     // X: Spread wide
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // Y: Spread high
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z: Depth

      vel[i] = Math.random() * 0.2 + 0.1; // Random variance in speed
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  // Animation Loop (Runs 60fps)
  useFrame(() => {
    if (!mesh.current) return;

    // Access the raw geometric positions
    const positions = mesh.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      // Move down (Y-axis)
      positions[i * 3 + 1] -= config.speed * velocities[i];

      // Reset to top if it falls below screen
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 10;
        positions[i * 3] = (Math.random() - 0.5) * 20; // Randomize X again
      }

      // Wobble effect for Snow/Dust (X-axis movement)
      if (config.wobble) {
        positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.002;
      }
    }

    // Tell Three.js the positions have updated
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={config.size}
        color={config.color}
        transparent
        opacity={config.opacity}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

export default Precipitation;