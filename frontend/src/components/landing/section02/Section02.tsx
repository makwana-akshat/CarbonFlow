import React from "react";
import { BentoGrid } from "./BentoGrid";
import "./Section02.css";

export const Section02: React.FC = () => {
  return (
    <section
      id="section-02"
      aria-labelledby="section-02-heading"
      className="relative w-full carbonflow-section02 overflow-hidden border-t border-neutral-200/70 pt-20 md:pt-28 lg:pt-36 pb-24 md:pb-32 lg:pb-36"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
    

        {/* Section Heading: Poppins, 56px desktop/tablet, 32px mobile, 600-700 weight, -6% tracking, solid text */}
        <h2
          id="section-02-heading"
          className="carbonflow-section02-heading text-[32px] sm:text-[44px] md:text-[56px] font-bold tracking-[-0.06em] leading-[1.08] mb-5 md:mb-6 max-w-4xl"
        >
          Built to move captured CO₂.
        </h2>

        {/* Supporting Copy: Roboto, 18px desktop/tablet, 16px mobile, -2% tracking, constrained width */}
        <div className="carbonflow-section02-subcopy text-[16px] md:text-[18px] max-w-[680px] mb-12 md:mb-16 space-y-1.5 font-normal">
          <p>
            One network connects suppliers, utilization companies, procurement,
            and logistics.
          </p>
          <p>
            From the first match to final utilization, CarbonFlow keeps the
            flow visible.
          </p>
        </div>

        {/* 4-Cell Asymmetric Video Bento Grid */}
        <BentoGrid />
      </div>
    </section>
  );
};

export default Section02;
