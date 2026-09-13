import React from "react";
import "./FinalSection.css";
import CarbonFlowFlowCore from "./CarbonFlowFlowCore";
import FinalCta from "./FinalCta";
import LandingFooter from "./LandingFooter";

export const FinalSection: React.FC = () => {
  return (
    <section
      id="final-section"
      className="carbonflow-final-section relative w-full overflow-hidden bg-[#07060A] text-white pt-24 sm:pt-32 md:pt-36"
    >
      {/* Ambient background atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(244, 97, 30, 0.08) 0%, rgba(10, 10, 15, 0) 65%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* Main Two-Column CTA Presentation Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Flow Core Visual (5 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-start">
            <CarbonFlowFlowCore />
          </div>

          {/* Right Column: Final CTA & Value Proposition (6 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-start">
            <FinalCta className="w-full max-w-xl" />
          </div>
        </div>
      </div>

      {/* Embedded Compact Footer */}
      <LandingFooter />
    </section>
  );
};

export default FinalSection;
