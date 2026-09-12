import React from 'react';
import { projectCoords, SVG_W, SVG_H } from './MapCanvas';
import type { RouteData } from '../../types/maps';

interface RouteOverlayProps {
  routes: RouteData[];
  selectedRouteId: string | null;
  onSelectRoute: (route: RouteData) => void;
}

/**
 * RouteOverlay renders SVG polylines connecting supplier → buyer.
 * Overlaid as an absolutely-positioned SVG that shares the same
 * coordinate system as MapCanvas.
 */
export const RouteOverlay: React.FC<RouteOverlayProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
}) => {
  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        {/* Arrow marker for route direction */}
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#0A0A0A" opacity="0.6" />
        </marker>
        <marker id="arrow-selected" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#F4611E" />
        </marker>
      </defs>

      {routes.map((route) => {
        const from = projectCoords(route.fromCoords);
        const to = projectCoords(route.toCoords);
        const isSelected = route.id === selectedRouteId;
        const isRecommended = route.isRecommended;

        // Control point for gentle curve
        const cx = (from.x + to.x) / 2;
        const cy = (from.y + to.y) / 2 - 30;

        // Midpoint for clickable label
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2 - 15;

        return (
          <g key={route.id}>
            {/* Route path */}
            <path
              d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
              fill="none"
              stroke={isSelected ? '#F4611E' : isRecommended ? '#0A0A0A' : '#8A8A85'}
              strokeWidth={isSelected ? 2.5 : 1.5}
              strokeDasharray={isRecommended ? undefined : '6,4'}
              opacity={isSelected ? 1 : 0.55}
              markerEnd={isSelected ? 'url(#arrow-selected)' : 'url(#arrow)'}
              strokeLinecap="round"
            />

            {/* Clickable hit area */}
            <path
              d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
              fill="none"
              stroke="transparent"
              strokeWidth="14"
              className="pointer-events-auto cursor-pointer"
              onClick={() => onSelectRoute(route)}
              aria-label={`Route: ${route.supplierName} to ${route.buyerName}, ${route.distanceKm} km`}
              role="button"
            />

            {/* Distance label at midpoint */}
            {isSelected && (
              <text
                x={mx}
                y={my}
                textAnchor="middle"
                fill="#F4611E"
                fontSize="9"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {route.distanceKm} km
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
