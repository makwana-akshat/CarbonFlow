import React from "react";

export type CubicVariant = "matchmaking" | "logistics" | "execution";

interface CubicVisualProps {
  variant: CubicVariant;
  className?: string;
}

interface VoxelProps {
  x: number;
  y: number;
  size?: number;
  colorType?: "neutral" | "accent" | "dark" | "outline";
  opacity?: number;
}

const IsoVoxel: React.FC<VoxelProps> = ({
  x,
  y,
  size = 18,
  colorType = "neutral",
  opacity = 1,
}) => {
  const w = size * 0.866; // cos(30 deg) * size
  const h = size * 0.5; // sin(30 deg) * size
  const d = size; // vertical height of cube

  // Palette mapping
  const colors = {
    neutral: {
      top: "#FFFFFF",
      left: "#EAE7E0",
      right: "#D3CFCA",
      stroke: "#BDB9B2",
    },
    accent: {
      top: "#FF7B40",
      left: "#F4611E",
      right: "#D2480B",
      stroke: "#B83B06",
    },
    dark: {
      top: "#38383D",
      left: "#26262A",
      right: "#1A1A1D",
      stroke: "#4A4A52",
    },
    outline: {
      top: "rgba(244, 97, 30, 0.08)",
      left: "rgba(244, 97, 30, 0.05)",
      right: "rgba(244, 97, 30, 0.12)",
      stroke: "rgba(244, 97, 30, 0.45)",
    },
  }[colorType];

  return (
    <g opacity={opacity} className="transition-all duration-300">
      {/* Top Face */}
      <polygon
        points={`${x},${y - h} ${x + w},${y} ${x},${y + h} ${x - w},${y}`}
        fill={colors.top}
        stroke={colors.stroke}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Left Face */}
      <polygon
        points={`${x - w},${y} ${x},${y + h} ${x},${y + h + d} ${x - w},${y + d}`}
        fill={colors.left}
        stroke={colors.stroke}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Right Face */}
      <polygon
        points={`${x + w},${y} ${x},${y + h} ${x},${y + h + d} ${x + w},${y + d}`}
        fill={colors.right}
        stroke={colors.stroke}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </g>
  );
};

export const CubicVisual: React.FC<CubicVisualProps> = ({
  variant,
  className = "",
}) => {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 240 180"
        className="w-full h-full max-h-[170px] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle radial ambient floor shadow */}
          <radialGradient
            id={`ambient-shadow-${variant}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient floor shadow under cubic cluster */}
        <ellipse
          cx="120"
          cy="138"
          rx="65"
          ry="18"
          fill={`url(#ambient-shadow-${variant})`}
        />

        {/* =============================================================== */}
        {/* VARIANT 1: AI MATCHMAKING — Fragmented pieces aligning to match  */}
        {/* =============================================================== */}
        {variant === "matchmaking" && (
          <g>
            {/* Subtle alignment guide grid */}
            <line
              x1="65"
              y1="60"
              x2="175"
              y2="124"
              stroke="#E2DFD8"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <line
              x1="175"
              y1="60"
              x2="65"
              y2="124"
              stroke="#E2DFD8"
              strokeWidth="1"
              strokeDasharray="3 4"
            />

            {/* Target alignment dock marker */}
            <polygon
              points="120,83 135.6,92 120,101 104.4,92"
              fill="none"
              stroke="rgba(244, 97, 30, 0.3)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />

            {/* Voxel 1: Fragmented supply node (upper-left) */}
            <g className="animate-iso-match-1">
              <IsoVoxel x={104} y={74} size={16} colorType="neutral" />
            </g>

            {/* Voxel 2: Fragmented demand node (upper-right) */}
            <g className="animate-iso-match-2">
              <IsoVoxel x={136} y={74} size={16} colorType="neutral" />
            </g>

            {/* Voxel 3: Specification node (lower-left) */}
            <g className="animate-iso-match-3">
              <IsoVoxel x={104} y={92} size={16} colorType="dark" />
            </g>

            {/* Voxel 4: Volume & logistics node (lower-right) */}
            <g className="animate-iso-match-4">
              <IsoVoxel x={136} y={92} size={16} colorType="neutral" />
            </g>

            {/* Accent Voxel: CarbonFlow AI Matchmaker clicking into alignment */}
            <g className="animate-iso-match-accent">
              <IsoVoxel x={120} y={83} size={17} colorType="accent" />
            </g>
          </g>
        )}

        {/* =============================================================== */}
        {/* VARIANT 2: LOGISTICS INTELLIGENCE — Sliding transit relay      */}
        {/* =============================================================== */}
        {variant === "logistics" && (
          <g>
            {/* Isometric railway / highway transit corridor vector */}
            <line
              x1="55"
              y1="52"
              x2="185"
              y2="128"
              stroke="#F4611E"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="animate-iso-logistics-line"
            />
            <line
              x1="45"
              y1="64"
              x2="175"
              y2="140"
              stroke="#E0DDD6"
              strokeWidth="1"
              strokeDasharray="2 4"
            />

            {/* Waypoint nodes: Origin -> Intermodal Hub -> Offtake */}
            <circle cx="70" cy="61" r="3" fill="#B5B2AC" />
            <circle cx="120" cy="90" r="4" fill="#F4611E" />
            <circle cx="170" cy="119" r="3" fill="#B5B2AC" />

            {/* Stationary Intermodal Hub base at (120, 90) */}
            <IsoVoxel x={120} y={82} size={18} colorType="dark" />

            {/* Sliding cargo block A (moving from origin through corridor) */}
            <g className="animate-iso-logistics-a">
              <IsoVoxel x={120} y={82} size={15} colorType="neutral" />
            </g>

            {/* Accent logistics routing unit B (cycling and adjusting vector) */}
            <g className="animate-iso-logistics-b">
              <IsoVoxel x={136} y={91} size={16} colorType="accent" />
            </g>
          </g>
        )}

        {/* =============================================================== */}
        {/* VARIANT 3: TRUSTED EXECUTION — Multi-layer stacking & verified  */}
        {/* =============================================================== */}
        {variant === "execution" && (
          <g>
            {/* Hexagonal verification completion ring */}
            <polygon
              points="120,48 162,72 162,120 120,144 78,120 78,72"
              fill="none"
              stroke="#34C77B"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              className="animate-iso-exec-pulse"
              style={{ transformOrigin: "120px 96px" }}
            />

            {/* Base Tier (Match & Procurement baseline) */}
            <g className="animate-iso-exec-bottom">
              <IsoVoxel x={104} y={106} size={17} colorType="dark" />
              <IsoVoxel x={136} y={106} size={17} colorType="neutral" />
            </g>

            {/* Middle Tier (Smart contract & logistics execution) */}
            <g className="animate-iso-exec-mid">
              <IsoVoxel x={120} y={92} size={17} colorType="neutral" />
            </g>

            {/* Crown Tier (Offtake verification & verified impact lock) */}
            <g className="animate-iso-exec-top">
              <IsoVoxel x={120} y={74} size={18} colorType="accent" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default CubicVisual;
