/**
 * MapCanvas — SVG-based mock map of India.
 *
 * PROVIDER ABSTRACTION:
 * This component is the ONLY one that needs to be replaced when integrating
 * a real map provider (Google Maps, Mapbox). All markers, overlays, and
 * detail panels are children rendered on top of this canvas via absolute
 * positioning and the coordinate projection helper exported below.
 *
 * Coordinate projection:
 *   projectCoords(lat, lng) → { x: number, y: number } in SVG viewport pixels
 */

import React, { useRef } from 'react';
import { INDIA_BOUNDS, type GeoPoint } from '../../types/maps';

// SVG canvas dimensions
export const SVG_W = 1000;
export const SVG_H = 800;

/** Project lat/lng into SVG pixel coordinates */
export function projectCoords(coords: GeoPoint): { x: number; y: number } {
  const { minLat, maxLat, minLng, maxLng } = INDIA_BOUNDS;
  const x = ((coords.lng - minLng) / (maxLng - minLng)) * SVG_W;
  // Invert Y: higher lat = lower y value
  const y = ((maxLat - coords.lat) / (maxLat - minLat)) * SVG_H;
  return { x, y };
}

interface MapCanvasProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * MapCanvas renders the India SVG outline as the geographical backdrop.
 * Children are absolutely positioned overlays (markers, routes, heatmaps).
 */
export const MapCanvas: React.FC<MapCanvasProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#EDF3F0] ${className}`}
      style={{ minHeight: '100%' }}
    >
      {/* Base SVG Map Layer */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D8E6DF" strokeWidth="0.5" />
          </pattern>
          {/* Ocean texture */}
          <linearGradient id="ocean-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D6E8E0" />
            <stop offset="100%" stopColor="#C8DDD5" />
          </linearGradient>
        </defs>

        {/* Ocean background */}
        <rect width={SVG_W} height={SVG_H} fill="url(#ocean-grad)" />
        <rect width={SVG_W} height={SVG_H} fill="url(#map-grid)" />

        {/* ── India landmass outline (simplified path) ── */}
        {/* Approximate SVG path derived from India's geography */}
        <g id="india-landmass">
          {/* Main peninsula */}
          <path
            d={`
              M 230 30  L 380 20  L 440 35  L 520 25  L 620 60  L 680 50
              L 750 80  L 820 120 L 850 160 L 880 200 L 870 250 L 850 310
              L 820 360 L 780 400 L 750 430 L 710 470 L 680 500 L 650 540
              L 620 570 L 590 600 L 565 630 L 545 660 L 530 700 L 520 740
              L 505 760 L 490 740 L 475 700 L 460 660 L 440 620 L 410 580
              L 380 550 L 350 510 L 320 470 L 290 430 L 260 390 L 240 350
              L 220 310 L 210 270 L 200 230 L 195 190 L 190 150 L 200 110
              L 210 80  L 220 55  Z
            `}
            fill="#E8F0EB"
            stroke="#C4D5CC"
            strokeWidth="1.5"
          />
          {/* Kashmir / Northern region */}
          <path
            d={`
              M 230 30 L 250 10 L 300 5  L 350 10 L 380 20
            `}
            fill="#E8F0EB"
            stroke="#C4D5CC"
            strokeWidth="1.5"
          />
          {/* Andaman outline (simplified) */}
          <ellipse cx="870" cy="620" rx="15" ry="30" fill="#E8F0EB" stroke="#C4D5CC" strokeWidth="1" />
        </g>

        {/* ── State boundary lines (approximate) ── */}
        <g id="state-lines" stroke="#D0DDD5" strokeWidth="0.8" fill="none" strokeDasharray="4,3">
          {/* Gujarat southern border */}
          <line x1="195" y1="340" x2="430" y2="340" />
          {/* Maharashtra northern */}
          <line x1="195" y1="450" x2="520" y2="450" />
          {/* Karnataka */}
          <line x1="260" y1="560" x2="530" y2="560" />
          {/* Vertical Rajasthan/Gujarat */}
          <line x1="290" y1="30" x2="290" y2="340" />
          {/* MP line */}
          <line x1="350" y1="200" x2="680" y2="200" />
          {/* Andhra */}
          <line x1="400" y1="470" x2="650" y2="470" />
        </g>

        {/* ── City reference dots ── */}
        <g id="city-refs" fill="#A8C0B5" opacity="0.6">
          {/* Ahmedabad */ }<circle cx="292" cy="290" r="2" />
          {/* Surat */}<circle cx="275" cy="358" r="2" />
          {/* Jamnagar */}<circle cx="204" cy="316" r="2" />
          {/* Vadodara */}<circle cx="307" cy="320" r="2" />
          {/* Mundra */}<circle cx="185" cy="292" r="2" />
          {/* Mumbai */}<circle cx="258" cy="430" r="2" />
          {/* Pune */}<circle cx="272" cy="455" r="2" />
          {/* Delhi */}<circle cx="370" cy="162" r="2" />
          {/* Chennai */}<circle cx="490" cy="582" r="2" />
        </g>

        {/* ── Major rivers (very simplified) ── */}
        <g id="rivers" stroke="#C4D5CC" strokeWidth="0.8" fill="none" opacity="0.7">
          {/* Narmada */}
          <path d="M 195 350 Q 320 355 430 345 Q 500 340 540 345" />
          {/* Tapti */}
          <path d="M 195 360 Q 260 365 310 360" />
        </g>

        {/* ── Sea labels ── */}
        <text x="100" y="500" fill="#A8C0B5" fontSize="11" fontFamily="Inter, sans-serif" opacity="0.7" fontStyle="italic">
          Arabian Sea
        </text>
        <text x="640" y="480" fill="#A8C0B5" fontSize="11" fontFamily="Inter, sans-serif" opacity="0.7" fontStyle="italic">
          Bay of Bengal
        </text>
        <text x="440" y="780" fill="#A8C0B5" fontSize="10" fontFamily="Inter, sans-serif" opacity="0.7" fontStyle="italic">
          Indian Ocean
        </text>
      </svg>

      {/* Children: markers, overlays, routes rendered on top via absolute positioning */}
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default MapCanvas;
