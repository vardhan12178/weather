
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const Sunny = () => {
  return (
    <>

      <Sphere position={[2, 2, -5]} args={[0.5, 32, 32]}>
        <meshBasicMaterial color="#ffdd00" />
      </Sphere>
      <pointLight position={[2, 2, -5]} color="#ffdd00" intensity={2} distance={20} />
    </>
  );
};

const SunnyEffect = () => {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'radial-gradient(circle, #87CEEB, #FFD700)', // Bright sky gradient
      }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <ambientLight intensity={0.8} />
      <Sunny />
    </Canvas>
  );
};

export default SunnyEffect;