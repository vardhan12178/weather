// src/effects/RainEffect.js
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const Rain = () => {
  const count = 500; // Number of raindrops
  const rainRef = useRef();

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10; // X position
      positions[i * 3 + 1] = Math.random() * 10; // Y position (start above)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z position
      velocities[i] = -Math.random() * 0.1 - 0.05; // Falling speed
    }

    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    const positionsArray = rainRef.current.geometry.attributes.position.array;
    const velocities = positions.velocities;

    for (let i = 0; i < count; i++) {
      positionsArray[i * 3 + 1] += velocities[i]; // Update Y position (falling)
      if (positionsArray[i * 3 + 1] < -5) {
        positionsArray[i * 3 + 1] = 5; // Reset to top
      }
    }

    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions.positions}
          itemSize={3}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.05} transparent opacity={0.8} />
    </points>
  );
};

const RainEffect = () => {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'rgba(0, 0, 0, 0.3)', // Dark overlay for rainy atmosphere
      }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Rain />
    </Canvas>
  );
};

export default RainEffect;