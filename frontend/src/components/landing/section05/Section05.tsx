import React, { useState } from "react";
import { IntelligenceOrbShowcase } from "./IntelligenceOrbShowcase";
import { IntelligenceCapabilityGrid } from "./IntelligenceCapabilityGrid";
import "./Section05.css";

export const Section05: React.FC = () => {
  const [activeCapability, setActiveCapability] = useState<string | null>(null);

  return (
    <section
      id="section-05"
      aria-labelledby="section-05-heading"
      className="carbonflow-section05 relative w-full overflow-hidden border-t border-[#EAE7E1] pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-36 lg:pb-40"
    >
      <div className="carbonflow-section05-background" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="carbonflow-section05-intro mx-auto max-w-[820px] text-center">


          <h2
            id="section-05-heading"
            className="carbonflow-section05-heading mx-auto mb-5 max-w-[920px] text-[32px] font-bold leading-[1.08] text-[#101114] sm:text-[44px] md:text-[56px]"
          >
            The intelligence layer for every carbon decision.
          </h2>

          <p className="carbonflow-section05-subcopy mx-auto max-w-[620px] text-[16px] leading-[1.62] text-[#5F5B55] md:text-[18px]">
            CarbonFlow brings marketplace intelligence, recommendations,
            alerts, and natural-language assistance into one connected
            experience.
          </p>
        </div>

        <div
          className="carbonflow-intelligence-field relative mx-auto mt-14 max-w-[1120px] sm:mt-16 lg:mt-20"
          data-active={activeCapability ? "true" : "false"}
        >
          <IntelligenceOrbShowcase
            activeCapability={activeCapability}
            className="carbonflow-intelligence-orb-slot"
          />
          <IntelligenceCapabilityGrid
            activeCapability={activeCapability}
            onCapabilityActive={setActiveCapability}
          />
        </div>
      </div>
    </section>
  );
};

export default Section05;
