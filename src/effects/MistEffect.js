// src/effects/MistEffect.js
import React from 'react';

const MistEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 opacity-20 backdrop-blur-sm" />
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="mist-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default MistEffect;