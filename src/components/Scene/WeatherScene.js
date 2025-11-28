import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Stars } from '@react-three/drei';
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
  const isFoggy = ['Mist', 'Smoke', 'Fog', 'Haze'].includes(main); // Upward particles
  const isDusty = ['Dust', 'Sand', 'Ash'].includes(main); // Floating particles
  const isTornado = ['Tornado', 'Squall'].includes(main); // Spiral particles

  // 3. Dynamic Background Colors
  let bgColor = isDay ? '#bae6fd' : '#111827'; 

  if (isStorm || isRain) bgColor = isDay ? '#64748b' : '#0f172a'; 
  if (isFoggy) bgColor = isDay ? '#cbd5e1' : '#374151'; 
  if (isDusty) bgColor = isDay ? '#fbbf24' : '#451a03'; 
  if (isTornado) bgColor = '#1f2937'; // Dark Grey for Tornado

  // 4. Fog Config (Camera Depth)
  const fogColor = isDusty ? '#fbbf24' : bgColor;

  return (
    <>
      <color attach="background" args={[bgColor]} />
      {/* Fog creates the visual depth (Objects fade into distance) */}
      <fog attach="fog" args={[fogColor, 5, isFoggy ? 12 : 60]} /> 

      <ambientLight intensity={isDay ? 0.8 : 0.3} />
      <directionalLight position={[10, 10, 5]} intensity={isDay ? 1.2 : 0.5} />
      {isStorm && <ThunderFlash />}

      {/* CLOUDS */}
      {isCloudy && (
        <group position={[0, 2, -5]}>
          <Cloud opacity={isDay ? 0.5 : 0.3} speed={0.4} width={10} depth={1.5} segments={20} />
        </group>
      )}

      {/* --- PRECIPITATION MAPPING --- */}
      
      {/* 1. Falling Water */}
      {(isRain || isStorm) && <Precipitation type="Rain" count={1500} />}
      
      {/* 2. Frozen */}
      {isSnow && <Precipitation type="Snow" count={1000} />}
      
      {/* 3. Floating Atmosphere (Dust/Ash) */}
      {isDusty && <Precipitation type="Dust" count={1000} />}

      {/* 4. Rising Atmosphere (Smoke/Mist) - Uses 'Smoke' type for upward movement */}
      {isFoggy && <Precipitation type="Smoke" count={600} />}

      {/* 5. Extreme Wind (Tornado/Squall) */}
      {isTornado && <Precipitation type="Tornado" count={2000} />}


      {/* --- CELESTIAL BODIES --- */}
      {!isDay && !isCloudy && !isFoggy && !isTornado && (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      )}
      
      {isDay && !isCloudy && !isFoggy && !isRain && !isTornado && (
         <mesh position={[8, 5, -10]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial color={"#FDB813"} emissive={"#FFA500"} emissiveIntensity={3} />
         </mesh>
      )}
    </>
  );
};

export default WeatherScene;