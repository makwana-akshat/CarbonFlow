import React from "react";
import { BentoFeatureCard, type BentoFeature } from "./BentoFeatureCard";

export const BENTO_FEATURES: BentoFeature[] = [
  {
    id: "matchmaking",
    title: "AI MATCHMAKING.",
    description: "Find the right carbon supply for every requirement.",
    video: "/videos/carbonflow/bento-01.mp4",
    size: "small",
  },
  {
    id: "procurement",
    title: "AGGREGATE FRAGMENTED DEMAND.",
    description:
      "Turn many smaller requirements into one executable procurement plan.",
    video: "/videos/carbonflow/bento-02.mp4",
    size: "large",
  },
  {
    id: "logistics",
    title: "MOVE IT EFFICIENTLY.",
    description:
      "Compare routes, transport modes, cost, time, and network risk.",
    video: "/videos/carbonflow/bento-03.mp4",
    size: "large",
  },
  {
    id: "intelligence",
    title: "SEE THE CARBON FLOW.",
    description:
      "Understand supply, demand, prices, utilization, and impact.",
    video: "/videos/carbonflow/bento-04.mp4",
    size: "small",
  },
];

interface BentoGridProps {
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ className = "" }) => {
  const [bento01, bento02, bento03, bento04] = BENTO_FEATURES;

  return (
    <div className={`w-full flex flex-col gap-4 md:gap-5 ${className}`}>
      {/* Row 1: Asymmetric composition — Bento 01 (small ~35%) | Bento 02 (large ~65%) */}
      <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.65fr] gap-4 md:gap-5 w-full">
        <BentoFeatureCard
          feature={bento01}
          className="w-full h-[360px] md:h-[420px] lg:h-[440px]"
        />
        <BentoFeatureCard
          feature={bento02}
          className="w-full h-[420px] md:h-[420px] lg:h-[440px]"
        />
      </div>

      {/* Row 2: Inverted asymmetric composition — Bento 03 (large ~65%) | Bento 04 (small ~35%) */}
      <div className="grid grid-cols-1 md:grid-cols-[1.65fr_0.85fr] gap-4 md:gap-5 w-full">
        <BentoFeatureCard
          feature={bento03}
          className="w-full h-[400px] md:h-[420px] lg:h-[440px]"
        />
        <BentoFeatureCard
          feature={bento04}
          className="w-full h-[340px] md:h-[420px] lg:h-[440px]"
        />
      </div>
    </div>
  );
};

export default BentoGrid;
