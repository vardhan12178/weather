// src/effects/SnowEffect.js
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const Snow = () => {
  const count = 300; // Number of snowflakes
  const snowRef = useRef();

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10; // X position
      positions[i * 3 + 1] = Math.random() * 10; // Y position (start above)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z position
      velocities[i] = -Math.random() * 0.02 - 0.01; // Slower falling speed
    }

    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    const positionsArray = snowRef.current.geometry.attributes.position.array;
    const velocities = positions.velocities;

    for (let i = 0; i < count; i++) {
      positionsArray[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.001; // Gentle side-to-side motion
      positionsArray[i * 3 + 1] += velocities[i]; // Update Y position (falling)
      if (positionsArray[i * 3 + 1] < -5) {
        positionsArray[i * 3 + 1] = 5; // Reset to top
      }
    }

    snowRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={snowRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions.positions}
          itemSize={3}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.1} transparent opacity={0.9} />
    </points>
  );
};

const SnowEffect = () => {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'rgba(150, 150, 150, 0.5)', // Grayish overlay for snowy atmosphere
      }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Snow />
    </Canvas>
  );
};

export default SnowEffect;