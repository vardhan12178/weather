// src/effects/AshEffect.js
import React from 'react';

const AshEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="ash-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${2 + Math.random() * 2}px`, // Random size between 2px and 4px
            height: `${2 + Math.random() * 2}px`,
            opacity: 0.4 + Math.random() * 0.2, // Random opacity between 0.4 and 0.6
          }}
        />
      ))}
    </div>
  );
};

export default AshEffect;