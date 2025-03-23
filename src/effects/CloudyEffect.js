// src/effects/CloudyEffect.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const Cloud = () => {
  const cloudRef1 = useRef();
  const cloudRef2 = useRef();
  const cloudRef3 = useRef();

  useFrame(() => {
    // Animate clouds moving slowly across the screen
    cloudRef1.current.position.x += 0.01;
    cloudRef2.current.position.x += 0.008;
    cloudRef3.current.position.x += 0.006;

    if (cloudRef1.current.position.x > 5) cloudRef1.current.position.x = -5;
    if (cloudRef2.current.position.x > 5) cloudRef2.current.position.x = -5;
    if (cloudRef3.current.position.x > 5) cloudRef3.current.position.x = -5;
  });

  return (
    <>
      <Sphere ref={cloudRef1} position={[-2, 1, -3]} args={[0.8, 32, 32]}>
        <meshStandardMaterial color="#d3d3d3" transparent opacity={0.6} />
      </Sphere>
      <Sphere ref={cloudRef2} position={[0, 0, -4]} args={[1, 32, 32]}>
        <meshStandardMaterial color="#d3d3d3" transparent opacity={0.6} />
      </Sphere>
      <Sphere ref={cloudRef3} position={[2, 2, -5]} args={[0.6, 32, 32]}>
        <meshStandardMaterial color="#d3d3d3" transparent opacity={0.6} />
      </Sphere>
    </>
  );
};

const CloudyEffect = () => {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(to bottom, #b0c4de, #f5f5f5)', // Cloudy sky gradient
      }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Cloud />
    </Canvas>
  );
};

export default CloudyEffect;