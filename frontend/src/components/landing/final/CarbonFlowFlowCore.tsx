import React from "react";

interface CarbonFlowFlowCoreProps {
  className?: string;
}

export const CarbonFlowFlowCore: React.FC<CarbonFlowFlowCoreProps> = ({
  className = "",
}) => {
  return (
    <div
      aria-hidden="true"
      className={`group relative w-full aspect-square max-w-[480px] lg:max-w-[520px] mx-auto flex items-center justify-center select-none ${className}`}
    >
      {/* Deep atmospheric ambient backlight behind the flow core */}
      <div
        className="absolute -inset-6 sm:-inset-10 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(244,97,30,0.14)_0%,rgba(142,165,255,0.06)_40%,transparent_75%)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 500 500"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial gradient for the dark inner core */}
          <radialGradient id="core-base-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E1C24" />
            <stop offset="65%" stopColor="#121117" />
            <stop offset="100%" stopColor="#0A090D" />
          </radialGradient>

          {/* Calm pulsing center light */}
          <radialGradient id="core-glow-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F4611E" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#F4611E" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F4611E" stopOpacity="0" />
          </radialGradient>

          {/* Accent flow streak linear gradient */}
          <linearGradient id="flow-streak-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4611E" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#F4611E" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F4611E" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="flow-streak-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8EA5FF" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#8EA5FF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8EA5FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Telemetry Gauge Ring (R = 230) */}
        <circle
          cx="250"
          cy="250"
          r="230"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />

        {/* Perimeter Degree / Flow Ticks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          const rad = (angle * Math.PI) / 180;
          const x1 = 250 + 226 * Math.cos(rad);
          const y1 = 250 + 226 * Math.sin(rad);
          const x2 = 250 + 234 * Math.cos(rad);
          const y2 = 250 + 234 * Math.sin(rad);
          const isMajor = i % 6 === 0;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMajor ? "#F4611E" : "rgba(255, 255, 255, 0.2)"}
              strokeWidth={isMajor ? "1.5" : "1"}
            />
          );
        })}

        {/* =============================================================== */}
        {/* FOUR SEMANTIC MILESTONES: CAPTURE -> MATCH -> MOVE -> UTILIZE   */}
        {/* =============================================================== */}
        {/* 1. TOP: CAPTURE */}
        <g>
          <rect
            x="220"
            y="6"
            width="60"
            height="18"
            rx="4"
            fill="#121117"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
          <text
            x="250"
            y="19"
            textAnchor="middle"
            fill="#B8B5B0"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.12em"
          >
            CAPTURE
          </text>
          <circle cx="250" cy="30" r="2.5" fill="#F4611E" />
        </g>

        {/* 2. RIGHT: MATCH */}
        <g>
          <rect
            x="426"
            y="241"
            width="56"
            height="18"
            rx="4"
            fill="#121117"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
          <text
            x="454"
            y="254"
            textAnchor="middle"
            fill="#B8B5B0"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.12em"
          >
            MATCH
          </text>
          <circle cx="418" cy="250" r="2.5" fill="#F4611E" />
        </g>

        {/* 3. BOTTOM: MOVE */}
        <g>
          <rect
            x="224"
            y="476"
            width="52"
            height="18"
            rx="4"
            fill="#121117"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
          <text
            x="250"
            y="489"
            textAnchor="middle"
            fill="#B8B5B0"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.12em"
          >
            MOVE
          </text>
          <circle cx="250" cy="470" r="2.5" fill="#F4611E" />
        </g>

        {/* 4. LEFT: UTILIZE */}
        <g>
          <rect
            x="18"
            y="241"
            width="58"
            height="18"
            rx="4"
            fill="#121117"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
          <text
            x="47"
            y="254"
            textAnchor="middle"
            fill="#B8B5B0"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.12em"
          >
            UTILIZE
          </text>
          <circle cx="82" cy="250" r="2.5" fill="#F4611E" />
        </g>

        {/* Outer Rotating Flow Arc Layer 1 (Clockwise) */}
        <g className="animate-flow-cw">
          <circle
            cx="250"
            cy="250"
            r="195"
            stroke="url(#flow-streak-1)"
            strokeWidth="2.5"
            strokeDasharray="140 180"
            strokeLinecap="round"
          />
          <circle
            cx="445"
            cy="250"
            r="3.5"
            fill="#F4611E"
            className="shadow-sm"
          />
        </g>

        {/* Counter-Rotating Flow Arc Layer 2 (Counter-Clockwise) */}
        <g className="animate-flow-ccw">
          <circle
            cx="250"
            cy="250"
            r="165"
            stroke="url(#flow-streak-2)"
            strokeWidth="2"
            strokeDasharray="100 150"
            strokeLinecap="round"
          />
          <circle cx="250" cy="85" r="3" fill="#8EA5FF" />
          <circle cx="250" cy="415" r="3" fill="#8EA5FF" />
        </g>

        {/* Secondary Technical Guideline Ring (R = 140) */}
        <circle
          cx="250"
          cy="250"
          r="140"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Fast Orbiting Particle Relay (R = 118) */}
        <g className="animate-flow-cw-fast">
          <circle
            cx="250"
            cy="250"
            r="118"
            stroke="rgba(244, 97, 30, 0.4)"
            strokeWidth="1"
            strokeDasharray="60 220"
            strokeLinecap="round"
          />
          <polygon
            points="368,250 363,247 363,253"
            fill="#F4611E"
          />
        </g>

        {/* Dark Industrial Hub Core Disc (R = 98) */}
        <circle
          cx="250"
          cy="250"
          r="98"
          fill="url(#core-base-gradient)"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="1.5"
        />

        {/* Central Core Ambient Glow Halo */}
        <circle
          cx="250"
          cy="250"
          r="92"
          fill="url(#core-glow-gradient)"
          className="animate-flow-pulse"
        />

        {/* Central Aperture Inner Border */}
        <circle
          cx="250"
          cy="250"
          r="54"
          fill="#0D0C11"
          stroke="rgba(244, 97, 30, 0.4)"
          strokeWidth="1.5"
        />

        {/* Central Technical CO2 Flow Emblem */}
        <g className="animate-flow-pulse">
          {/* Hexagonal molecular aperture */}
          <polygon
            points="250,222 274,236 274,264 250,278 226,264 226,236"
            fill="none"
            stroke="#F4611E"
            strokeWidth="1.8"
          />
          {/* Center core pulse node */}
          <circle cx="250" cy="250" r="6" fill="#F4611E" />
          <circle cx="250" cy="250" r="14" stroke="rgba(244, 97, 30, 0.4)" strokeWidth="1" />
        </g>

        {/* Discrete Cardinal Vector Lines */}
        <line x1="250" y1="160" x2="250" y2="188" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
        <line x1="250" y1="312" x2="250" y2="340" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
        <line x1="160" y1="250" x2="188" y2="250" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
        <line x1="312" y1="250" x2="340" y2="250" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default CarbonFlowFlowCore;
