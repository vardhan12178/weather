// src/effects/DustEffect.js
import React from 'react';

const DustEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${1 + Math.random() * 2}px`, // Random size between 1px and 3px
            height: `${1 + Math.random() * 2}px`,
            opacity: 0.5 + Math.random() * 0.2, // Random opacity between 0.5 and 0.7
          }}
        />
      ))}
    </div>
  );
};

export default DustEffect;