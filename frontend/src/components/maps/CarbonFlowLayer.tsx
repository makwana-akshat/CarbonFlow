import React from 'react';
import { projectCoords, SVG_W, SVG_H } from './MapCanvas';
import type { CarbonFlowEdge } from '../../types/maps';

interface CarbonFlowLayerProps {
  edges: CarbonFlowEdge[];
  selectedEdgeId: string | null;
  onSelectEdge?: (edge: CarbonFlowEdge) => void;
}

const MAX_VOLUME = 31000; // used for stroke-width normalization

/**
 * CarbonFlowLayer renders animated flow lines between supplier and buyer nodes.
 * Line thickness reflects annual CO₂ volume. A CSS animation moves a dash
 * pattern along the path to simulate directional CO₂ flow.
 * Motion is subtle and slow — avoids being distracting.
 */
export const CarbonFlowLayer: React.FC<CarbonFlowLayerProps> = ({
  edges,
  selectedEdgeId,
  onSelectEdge,
}) => {
  return (
    <>
      {/* Inject keyframe animation for flow dash */}
      <style>{`
        @keyframes flowDash {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        .flow-line-active {
          animation: flowDash 2.5s linear infinite;
          stroke-dasharray: 12, 8;
        }
        .flow-line-inactive {
          stroke-dasharray: 6, 8;
          opacity: 0.3;
        }
      `}</style>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Carbon flow network"
      >
        <defs>
          <marker id="flow-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M 0 0 L 5 2.5 L 0 5 Z" fill="#F4611E" opacity="0.8" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const from = projectCoords(edge.fromCoords);
          const to = projectCoords(edge.toCoords);
          const isSelected = edge.id === selectedEdgeId;

          // Normalize stroke width to 1.5–5px range
          const strokeWidth = 1.5 + (edge.annualVolumeTonnes / MAX_VOLUME) * 3.5;

          // Gentle arc control point
          const cx = (from.x + to.x) / 2 + (from.y - to.y) * 0.15;
          const cy = (from.y + to.y) / 2 - (to.x - from.x) * 0.15;

          const pathD = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;

          return (
            <g key={edge.id}>
              {/* Glow/shadow under active lines */}
              {edge.isActive && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#F4611E"
                  strokeWidth={strokeWidth + 3}
                  opacity={0.08}
                  strokeLinecap="round"
                />
              )}

              {/* Main flow line */}
              <path
                d={pathD}
                fill="none"
                stroke={isSelected ? '#F4611E' : edge.isActive ? '#E8622E' : '#8A8A85'}
                strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
                strokeLinecap="round"
                markerEnd="url(#flow-arrow)"
                className={edge.isActive ? 'flow-line-active' : 'flow-line-inactive'}
                opacity={edge.isActive ? (isSelected ? 1 : 0.7) : 0.3}
              />

              {/* Clickable hit-area */}
              {onSelectEdge && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  className="pointer-events-auto cursor-pointer"
                  onClick={() => onSelectEdge(edge)}
                />
              )}

              {/* Volume label on selected */}
              {isSelected && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 10}
                  textAnchor="middle"
                  fill="#F4611E"
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none"
                >
                  {(edge.annualVolumeTonnes / 1000).toFixed(1)}kt/yr
                </text>
              )}
            </g>
          );
        })}

        {/* Node dots for suppliers and buyers in flow mode */}
        {edges.map((edge) => {
          const from = projectCoords(edge.fromCoords);
          const to = projectCoords(edge.toCoords);
          return (
            <g key={`nodes-${edge.id}`} className="pointer-events-none">
              <circle cx={from.x} cy={from.y} r="5" fill="#0A0A0A" opacity="0.8" />
              <circle cx={to.x} cy={to.y} r="4" fill="#2E8B57" opacity="0.8" />
            </g>
          );
        })}
      </svg>
    </>
  );
};
