/**
 * routeService — Route calculation, alternatives, and emission estimation.
 * Currently uses mock geometry. Architecture is ready for Google Directions API.
 * Future: call GET /api/v1/routes/optimize with origin/destination coords.
 */

import type { GeoPoint } from '../types/maps';

/** Generate a realistic route geometry (mock curved path between two points) */
export function generateRouteGeometry(from: GeoPoint, to: GeoPoint, curveOffset = 0.3): GeoPoint[] {
  const midLat = (from.lat + to.lat) / 2 + (to.lng - from.lng) * curveOffset * 0.1;
  const midLng = (from.lng + to.lng) / 2 - (to.lat - from.lat) * curveOffset * 0.1;

  const points: GeoPoint[] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const t1 = 1 - t;
    // Quadratic Bezier: P = (1-t)²·A + 2(1-t)t·M + t²·B
    const lat = t1 * t1 * from.lat + 2 * t1 * t * midLat + t * t * to.lat;
    const lng = t1 * t1 * from.lng + 2 * t1 * t * midLng + t * t * to.lng;
    points.push({ lat, lng });
  }
  return points;
}

/** Estimate transport emissions in tCO₂e based on distance and mode */
export function estimateEmissions(
  distanceKm: number,
  mode: 'Road' | 'Rail' | 'Pipeline' | 'Barge'
): number {
  const factors: Record<string, number> = {
    Road: 0.015,     // tCO₂e per km (for CO₂ transport truck)
    Rail: 0.008,
    Pipeline: 0.002,
    Barge: 0.006,
  };
  return parseFloat((distanceKm * (factors[mode] || 0.01)).toFixed(1));
}
