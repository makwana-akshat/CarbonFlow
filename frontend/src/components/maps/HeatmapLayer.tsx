import React from 'react';
import { projectCoords, SVG_W, SVG_H } from './MapCanvas';
import type { RegionData } from '../../types/maps';

type HeatmapSubMode = 'supply' | 'demand' | 'price';

interface HeatmapLayerProps {
  regions: RegionData[];
  subMode: HeatmapSubMode;
  selectedRegionId: string | null;
  onSelectRegion: (region: RegionData) => void;
}

/** Returns a fill color based on normalized intensity 0→1 for each heatmap mode */
function getHeatColor(intensity: number, subMode: HeatmapSubMode): string {
  if (subMode === 'supply') {
    // Low (pale green) → High (deep green)
    const r = Math.round(232 - intensity * 100);
    const g = Math.round(240 - intensity * 60);
    const b = Math.round(235 - intensity * 120);
    return `rgb(${r},${g},${b})`;
  }
  if (subMode === 'demand') {
    // Low (pale blue) → High (deep blue)
    const r = Math.round(220 - intensity * 80);
    const g = Math.round(235 - intensity * 60);
    const b = Math.round(240 - intensity * 30);
    return `rgb(${r},${g},${b})`;
  }
  // price: Low (pale yellow) → High (orange)
  const r = Math.round(253 - intensity * 50);
  const g = Math.round(244 - intensity * 120);
  const b = Math.round(200 - intensity * 160);
  return `rgb(${r},${g},${b})`;
}

/** Normalize a value within an array */
function normalize(value: number, values: number[]): number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return max === min ? 0.5 : (value - min) / (max - min);
}

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  regions,
  subMode,
  selectedRegionId,
  onSelectRegion,
}) => {
  // Pick which field to drive intensity
  const intensityValues = regions.map((r) => {
    if (subMode === 'supply') return r.supply.availableTonnes;
    if (subMode === 'demand') return r.demand.totalDemandTonnes;
    return r.price.avgPricePerTon;
  });

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
      aria-label={`${subMode} heatmap overlay`}
    >
      {regions.map((region, idx) => {
        const intensity = normalize(intensityValues[idx], intensityValues);
        const fillColor = getHeatColor(intensity, subMode);
        const isSelected = region.id === selectedRegionId;
        const centroid = projectCoords(region.coords);

        // Build polygon points string from region polygon coords
        const polygonPoints = region.polygon
          .map((pt) => {
            const { x, y } = projectCoords(pt);
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <g key={region.id}>
            {/* Filled heatmap polygon */}
            <polygon
              points={polygonPoints}
              fill={fillColor}
              fillOpacity={isSelected ? 0.85 : 0.65}
              stroke={isSelected ? '#F4611E' : '#B0C4BB'}
              strokeWidth={isSelected ? 2 : 0.8}
              className="pointer-events-auto cursor-pointer transition-all"
              onClick={() => onSelectRegion(region)}
              role="button"
              aria-label={`${region.name} — click for details`}
            />

            {/* Region label at centroid */}
            <text
              x={centroid.x}
              y={centroid.y}
              textAnchor="middle"
              fill={isSelected ? '#F4611E' : '#3A5248'}
              fontSize="9"
              fontWeight={isSelected ? '700' : '500'}
              fontFamily="Inter, sans-serif"
              className="pointer-events-none select-none"
            >
              {region.name.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
