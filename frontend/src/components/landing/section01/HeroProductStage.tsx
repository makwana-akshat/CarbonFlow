import React from 'react';

// Replace with final CarbonFlow hero product image supplied by project owner.
const PRODUCT_IMAGE_SRC = '/images/carbonflow/hero-product.webp';

const CAPABILITIES = [
  'AI MATCHING',
  'MARKETPLACE',
  'ROUTING',
  'LOGISTICS',
  'CONTRACTS',
  'IMPACT',
];

interface HeroProductStageProps {
  stageRef?: React.Ref<HTMLDivElement>;
}

export const HeroProductStage: React.FC<HeroProductStageProps> = ({ stageRef }) => {
  return (
    <div className="relative z-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-0 pb-28">
      {/* Large Product Image Stage Container — Connected to Beam */}
      <div
        ref={stageRef}
        className="hero-product-stage-container w-full max-w-[1240px] mx-auto aspect-[16/10] sm:aspect-[16/9.5] relative"
      >
        {/* Luminous flare connection crown where the beam meets the card */}
        <div
          className="absolute -top-1 left-[60%] -translate-x-1/2 w-96 h-2 bg-gradient-to-r from-transparent via-[#8EA5FF] to-transparent pointer-events-none blur-xs"
          aria-hidden="true"
        />
        <div
          className="absolute -top-0.5 left-[60%] -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none shadow-[0_0_20px_#8EA5FF]"
          aria-hidden="true"
        />

        {/* Replace with final CarbonFlow hero product image supplied by project owner. */}
        <img
          src={PRODUCT_IMAGE_SRC}
          alt="CarbonFlow B2B Industrial Carbon Clearing & Routing Interface"
          className="w-full h-full object-cover object-top select-none"
          loading="lazy"
        />

        {/* Atmospheric ambient flare overlay at base of image */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#03000a] via-transparent to-transparent opacity-80"
          aria-hidden="true"
        />
      </div>

      {/* Capability Strip Underneath Product Image */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 select-none">
        {CAPABILITIES.map((capability, idx) => (
          <React.Fragment key={capability}>
            <span className="capability-strip capability-strip-item">
              {capability}
            </span>
            {idx < CAPABILITIES.length - 1 && (
              <span className="text-white text-[10px]" aria-hidden="true">
                •
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HeroProductStage;
