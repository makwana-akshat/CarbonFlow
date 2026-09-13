import React from "react";
import { CubicVisual, type CubicVariant } from "./CubicVisual";
import { ArrowUpRight } from "lucide-react";

export interface PillarData {
  id: string;
  number: string;
  title: string;
  description: string;
  visual: CubicVariant;
}

interface PillarCardProps {
  pillar: PillarData;
  className?: string;
}

export const PillarCard: React.FC<PillarCardProps> = ({
  pillar,
  className = "",
}) => {
  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`${pillar.title} architectural pillar`}
      className={`group relative flex flex-col justify-between rounded-2xl border border-[#E5E3DF] bg-white p-6 sm:p-7 lg:p-8 transition-all duration-300 ease-out hover:border-[#D0CDC6] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${className}`}
    >
      <div>
        {/* Top: Dedicated Cubic Visual Viewport */}
        <div className="relative w-full h-[190px] sm:h-[210px] rounded-xl bg-[#F6F5F2] border border-[#ECEAE5] flex items-center justify-center overflow-hidden mb-7 transition-colors duration-300 group-hover:bg-[#F3F1EC] group-hover:border-[#E2DFD8]">
          {/* Subtle grid background texture */}
          <div
            className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#D5D2CA_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Living Cubic System Object */}
          <CubicVisual variant={pillar.visual} />
        </div>

        {/* Middle: Quiet Numeric Identifier */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[13px] font-semibold tracking-wider text-[#8A8A85] select-none">
            {pillar.number}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E0DDD6] transition-colors duration-300 group-hover:bg-[#F4611E]" />
        </div>

        {/* Title: Poppins, 20–24px, 600, solid text (no gradient) */}
        <h3 className="carbonflow-pillar-title text-[21px] sm:text-[22px] lg:text-[23px] font-semibold text-[#16171A] leading-tight mb-3 select-none">
          {pillar.title}
        </h3>

        {/* Description: Roboto, 15–16px, line-height 1.6 */}
        <p className="carbonflow-pillar-desc text-[15px] sm:text-[16px] text-[#5C5C58] leading-[1.62] select-none">
          {pillar.description}
        </p>
      </div>

      {/* Bottom: Subtle Technical Directional Micro-Action */}
      <div className="pt-6 mt-6 border-t border-[#F0EEEA] flex items-center justify-between text-[#8A8A85] text-xs font-mono select-none">
        <span className="tracking-wider uppercase text-[11px] font-medium text-[#7A7874] transition-colors duration-200 group-hover:text-[#16171A]">
          CORE ARCHITECTURE
        </span>
        <ArrowUpRight className="w-4 h-4 text-[#A5A29B] transition-all duration-300 group-hover:text-[#F4611E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>
  );
};

export default PillarCard;
