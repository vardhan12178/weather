import { describe, expect, it } from 'vitest';
import { distanceKm } from './geo';

describe('distanceKm', () => {
  it('measures real distances', () => {
    // Hyderabad → Mumbai is about 620 km
    expect(distanceKm({ lat: 17.385, lon: 78.487 }, { lat: 19.076, lon: 72.878 })).toBeGreaterThan(600);
    expect(distanceKm({ lat: 17.385, lon: 78.487 }, { lat: 19.076, lon: 72.878 })).toBeLessThan(640);
  });

  it('is ~0 for GPS jitter', () => {
    expect(distanceKm({ lat: 17.385, lon: 78.487 }, { lat: 17.3851, lon: 78.4872 })).toBeLessThan(0.05);
  });
});
