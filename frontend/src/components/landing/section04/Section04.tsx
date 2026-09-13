import React from "react";
import { CapabilityGrid } from "./CapabilityGrid";
import NeonBorder from "../../ui/neon-border";
import "./Section04.css";

export const Section04: React.FC = () => {
  return (
    <section
      id="section-04"
      aria-labelledby="section-04-heading"
      className="relative w-full carbonflow-section04 overflow-hidden border-t border-white/[0.08] pt-20 md:pt-28 lg:pt-36 pb-28 md:pb-36 lg:pb-40"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Editorial Top Area */}
        <div className="max-w-4xl mb-12 sm:mb-16">
  

          {/* Section Main Heading: Poppins, 56px desktop/tablet, 32px mobile, 700 weight, -6% tracking, solid white */}
          <h2
            id="section-04-heading"
            className="carbonflow-section04-heading text-[32px] sm:text-[44px] md:text-[56px] font-bold tracking-[-0.06em] leading-[1.08] text-white mb-5 sm:mb-6"
          >
            One platform.
            <br />
            Every step of the carbon flow.
          </h2>

          {/* Supporting Copy: Roboto, 18px desktop/tablet, 16px mobile, line-height 1.6, max width controlled */}
          <p className="carbonflow-section04-subcopy text-[16px] md:text-[18px] text-[#9E9CA3] leading-[1.62] max-w-[660px]">
            From the first supplier recommendation to procurement, routing,
            contracts, alerts, and impact reporting, CarbonFlow keeps the
            entire CO₂ transaction connected.
          </p>
        </div>

        {/* Large Centered Product Showcase */}
        <div className="relative w-full max-w-[1240px] mx-auto my-12 sm:my-16 lg:my-20">
          {/* Soft ambient glow behind product visual */}
          <div
            className="absolute -inset-4 sm:-inset-8 carbonflow-product-glow pointer-events-none -z-10"
            aria-hidden="true"
          />

          {/* Clean dark chassis container with animated neon border */}
          <div className="relative w-full rounded-2xl border border-white/[0.12] bg-[#141318] p-2 sm:p-3 shadow-[0_25px_60px_rgba(0,0,0,0.75)] overflow-hidden transition-all duration-500 ease-out hover:border-white/[0.18]">
            {/* Dynamic Neon Border tracing the visual frame perimeter */}
            <NeonBorder
              color="#F4611E"
              rounded={16}
              thickness={2.5}
              borderSize={45}
              glow={75}
              speed={13}
            />

            {/* Replace with final CarbonFlow platform showcase image supplied by owner. */}
            <img
              src="/images/carbonflow/platform-showcase.webp"
              alt="CarbonFlow Operations Platform Interface Showcase"
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-xl object-cover select-none relative z-1"
            />
          </div>
        </div>

        {/* Six Capability Modules (3 × 2 grid, airy non-card layout) */}
        <CapabilityGrid className="mt-8 sm:mt-12 lg:mt-16" />
      </div>
    </section>
  );
};

export default Section04;
