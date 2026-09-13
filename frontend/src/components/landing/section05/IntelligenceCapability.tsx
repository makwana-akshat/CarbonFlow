import React from "react";
import {
  IntelligenceVisualMark,
  type IntelligenceVisualType,
} from "./IntelligenceVisualMark";

export interface IntelligenceCapabilityData {
  id: string;
  title: string;
  description: string;
  visual: IntelligenceVisualType;
}

interface IntelligenceCapabilityProps {
  capability: IntelligenceCapabilityData;
  index: number;
  isActive: boolean;
  onActive: (id: string | null) => void;
}

export const IntelligenceCapability: React.FC<IntelligenceCapabilityProps> = ({
  capability,
  index,
  isActive,
  onActive,
}) => {
  return (
    <article
      className="carbonflow-intelligence-module group relative overflow-hidden rounded-[18px] border border-[#D8D2C7] bg-[#F7F4ED] p-5 outline-none transition-colors duration-200 sm:p-6"
      data-capability={capability.id}
      data-active={isActive ? "true" : "false"}
      style={{ "--module-index": index } as React.CSSProperties}
      tabIndex={0}
      onMouseEnter={() => onActive(capability.id)}
      onMouseLeave={() => onActive(null)}
      onFocus={() => onActive(capability.id)}
      onBlur={() => onActive(null)}
      aria-label={capability.title}
    >
      <div className="carbonflow-intelligence-module-light" aria-hidden="true" />

      <IntelligenceVisualMark type={capability.visual} />

      <h3 className="carbonflow-intelligence-module-title mt-5 text-[20px] font-semibold leading-[1.16] text-[#16171A] sm:text-[21px] lg:text-[22px]">
        {capability.title}
      </h3>

      <p className="carbonflow-intelligence-module-copy mt-2.5 text-[15px] leading-[1.58] text-[#645F57] sm:text-[16px]">
        {capability.description}
      </p>
    </article>
  );
};

export default IntelligenceCapability;
