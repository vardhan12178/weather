// src/effects/FogEffect.js
import React from 'react';

const FogEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gray-400 dark:bg-gray-800 opacity-50 backdrop-blur-md animate-pulse" />
    </div>
  );
};

export default FogEffect;