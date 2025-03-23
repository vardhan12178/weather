// src/effects/TornadoEffect.js
import React from 'react';

const TornadoEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Main Tornado Shape */}
      <div className="tornado" />
      {/* Swirling Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="tornado-particle"
          style={{
            left: `${50 + Math.cos((i / 20) * 2 * Math.PI) * 10}%`, // Circular path around the tornado
            bottom: `${(i / 20) * 200}px`, // Spread particles along the height
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default TornadoEffect;