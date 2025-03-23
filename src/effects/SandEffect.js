// src/effects/SandEffect.js
import React from 'react';

const SandEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="sand-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${3 + Math.random() * 2}px`, // Random size between 3px and 5px
            height: `${3 + Math.random() * 2}px`,
            opacity: 0.6 + Math.random() * 0.2, // Random opacity between 0.6 and 0.8
          }}
        />
      ))}
    </div>
  );
};

export default SandEffect;