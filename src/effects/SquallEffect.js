// src/effects/SquallEffect.js
import React from 'react';

const SquallEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(150)].map((_, i) => (
        <div
          key={i}
          className="squall-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `rotate(${45 + Math.random() * 30 - 15}deg)`, // Random angle between 30deg and 60deg
            opacity: 0.6 + Math.random() * 0.2, // Random opacity between 0.6 and 0.8
          }}
        />
      ))}
    </div>
  );
};

export default SquallEffect;