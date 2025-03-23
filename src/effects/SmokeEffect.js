// src/effects/SmokeEffect.js
import React from 'react';

const SmokeEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Subtle Base Overlay for Atmosphere */}
      <div className="absolute inset-0 bg-gray-700 dark:bg-gray-900 opacity-20" />

      {/* Smoke Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="smoke-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SmokeEffect;