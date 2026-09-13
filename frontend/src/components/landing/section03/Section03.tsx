import React from "react";
import { PillarCard, type PillarData } from "./PillarCard";
import "./Section03.css";

export const PILLARS: PillarData[] = [
  {
    id: "01",
    number: "01",
    title: "AI MATCHMAKING",
    description:
      "Match suppliers and utilization companies using purity, volume, price, location, availability, reliability, and application compatibility.",
    visual: "matchmaking",
  },
  {
    id: "02",
    number: "02",
    title: "LOGISTICS INTELLIGENCE",
    description:
      "Compare routes, transport modes, cost, time, emissions, and operational risk from supplier to buyer.",
    visual: "logistics",
  },
  {
    id: "03",
    number: "03",
    title: "TRUSTED EXECUTION",
    description:
      "Turn a match into an executable procurement plan, contract, delivery, and measurable utilization outcome.",
    visual: "execution",
  },
];

export const Section03: React.FC = () => {
  return (
    <section
      id="section-03"
      aria-labelledby="section-03-heading"
      className="relative w-full carbonflow-section03 overflow-hidden border-t border-[#EAE7E1] pt-20 md:pt-28 lg:pt-36 pb-24 md:pb-32 lg:pb-36"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Editorial Top Area */}
        <div className="mb-14 md:mb-18 lg:mb-20">
          {/* Left/Right Editorial Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Primary Large Statement (Poppins, 56px desktop/tablet, 32px mobile, 600-700, -6% tracking) */}
            <div className="lg:col-span-7">
              <h2
                id="section-03-heading"
                className="carbonflow-section03-heading text-[32px] sm:text-[44px] md:text-[56px] font-bold tracking-[-0.06em] leading-[1.08] text-[#16171A]"
              >
                Everything needed to move captured CO₂.
              </h2>
            </div>

            {/* Supporting Copy (Roboto, 18px desktop/tablet, 16px mobile, line-height 1.6, max width controlled) */}
            <div className="lg:col-span-5 lg:pb-2">
              <p className="carbonflow-section03-subcopy text-[16px] md:text-[18px] text-[#5C5C58] leading-[1.6] max-w-[500px]">
                CarbonFlow brings matching, fragmented-demand procurement,
                logistics, and transaction execution into one connected
                industrial network.
              </p>
            </div>
          </div>
        </div>

        {/* Three Core Platform Pillars (3-column layout on desktop, stacked on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section03;
