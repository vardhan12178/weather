// src/effects/HazeEffect.js
import React from 'react';

const HazeEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base Haze Overlay */}
      <div className="absolute inset-0 bg-yellow-200 dark:bg-gray-600 opacity-40 backdrop-blur-md" />
      
      {/* Drifting Particles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="haze-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};

export default HazeEffect;