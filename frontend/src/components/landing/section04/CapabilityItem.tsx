import React from "react";

export type CapabilityIconType =
  | "recommendations"
  | "explanations"
  | "allocation"
  | "maps"
  | "insights"
  | "contracts";

export interface CapabilityData {
  id: string;
  title: string;
  description: string;
  icon: CapabilityIconType;
}

interface CapabilityItemProps {
  capability: CapabilityData;
  className?: string;
}

const TechnicalIcon: React.FC<{ type: CapabilityIconType }> = ({ type }) => {
  switch (type) {
    case "recommendations":
      // Technical multi-node matching lattice
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white/80 transition-colors duration-300 group-hover:text-[#F4611E]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          <circle cx="4" cy="6" r="1.5" />
          <circle cx="20" cy="6" r="1.5" />
          <circle cx="4" cy="18" r="1.5" />
          <circle cx="20" cy="18" r="1.5" />
          <path d="M5.5 7L10 10.5M18.5 7L14 10.5M5.5 17L10 13.5M18.5 17L14 13.5" strokeDasharray="1.5 2" />
        </svg>
      );

    case "explanations":
      // Multi-metric factor calibration / score breakdown
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white/80 transition-colors duration-300 group-hover:text-[#F4611E]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" strokeOpacity="0.3" />
          <line x1="3" y1="6" x2="16" y2="6" stroke="currentColor" />
          <circle cx="16" cy="6" r="2" fill="#F4611E" stroke="none" />
          <line x1="3" y1="12" x2="21" y2="12" strokeOpacity="0.3" />
          <line x1="3" y1="12" x2="19" y2="12" stroke="currentColor" />
          <circle cx="19" cy="12" r="2" fill="currentColor" />
          <line x1="3" y1="18" x2="21" y2="18" strokeOpacity="0.3" />
          <line x1="3" y1="18" x2="13" y2="18" stroke="currentColor" />
          <circle cx="13" cy="18" r="2" fill="currentColor" />
        </svg>
      );

    case "allocation":
      // Branching aggregation & allocation flow tree
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white/80 transition-colors duration-300 group-hover:text-[#F4611E]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="4" height="4" rx="1" />
          <rect x="3" y="16" width="4" height="4" rx="1" />
          <rect x="17" y="10" width="4" height="4" rx="1" fill="#F4611E" stroke="none" />
          <path d="M7 6h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7" />
          <path d="M13 12h4" />
        </svg>
      );

    case "maps":
      // Geospatial coordinate matrix & telemetry reticle
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white/80 transition-colors duration-300 group-hover:text-[#F4611E]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="12" r="2" fill="#F4611E" stroke="none" />
        </svg>
      );

    case "insights":
      // Frequency telemetry wave / threshold signal
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white/80 transition-colors duration-300 group-hover:text-[#F4611E]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12h4l2-5 4 10 3-7 2 2h3" />
          <circle cx="17" cy="10" r="1.5" fill="#F4611E" stroke="none" />
        </svg>
      );

    case "contracts":
      // Cryptographic ledger block / verified agreement seal
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white/80 transition-colors duration-300 group-hover:text-[#F4611E]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h4" />
          <circle cx="16" cy="16" r="2.5" fill="#F4611E" stroke="none" />
          <path d="M15 16l1 1 2-2" stroke="#FFFFFF" strokeWidth="1.2" />
        </svg>
      );
  }
};

export const CapabilityItem: React.FC<CapabilityItemProps> = ({
  capability,
  className = "",
}) => {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={capability.title}
      className={`group relative flex flex-col items-start border-t border-white/[0.08] pt-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4611E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B0A0E] ${className}`}
    >
      {/* Top subtle highlight line indicator on hover */}
      <div
        className="absolute top-0 left-0 w-8 h-[1.5px] bg-transparent transition-all duration-300 group-hover:bg-[#F4611E] group-hover:w-16"
        aria-hidden="true"
      />

      {/* Technical geometric mark container */}
      <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5 transition-all duration-300 ease-out group-hover:bg-[#F4611E]/[0.08] group-hover:border-[#F4611E]/40 group-hover:-translate-y-0.5">
        <TechnicalIcon type={capability.icon} />
      </div>

      {/* Feature Title: Poppins, 20–22px, 600, solid white */}
      <h3 className="carbonflow-capability-title text-[20px] sm:text-[21px] lg:text-[22px] font-semibold text-white mb-2.5 leading-tight transition-colors duration-200 select-none">
        {capability.title}
      </h3>

      {/* Feature Description: Roboto, 15–16px, line-height 1.6 */}
      <p className="carbonflow-capability-desc text-[15px] sm:text-[16px] text-[#9E9CA3] leading-[1.62] transition-colors duration-200 group-hover:text-white/85 select-none">
        {capability.description}
      </p>
    </div>
  );
};

export default CapabilityItem;
