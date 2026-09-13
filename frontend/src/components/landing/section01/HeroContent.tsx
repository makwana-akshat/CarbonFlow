import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ArrowRight } from 'lucide-react';
import DecryptedText from '../../ui/DecryptedText';

export const HeroContent: React.FC = () => {
  const { isSignedIn } = useAuth();

  const ctaDestination = isSignedIn ? '/app/dashboard' : '/signup';

  return (
    <div className="carbonflow-layer-content relative z-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-24 pt-28 sm:pt-32 lg:pt-36 pb-10 sm:pb-14 flex flex-col justify-start">
      <div className="max-w-[700px] flex flex-col items-start text-left space-y-7">
        {/* Dominant Main Headline (Solid Poppins, 80px desktop, NO gradient text) */}
        <h1 className="hero-heading select-none">
          MOVE<br />
          CAPTURED CO₂
        </h1>

        {/* Supporting Copy (Constrained width, ~50-60 chars/line) */}
        <p className="hero-body">
          Connect captured CO₂ with the companies ready to put it to productive use.
          CarbonFlow matches fragmented supply and demand, optimizes the journey,
          and turns captured carbon into a productive industrial resource.
        </p>

        {/* CTA Button Group */}
        <div className="carbonflow-layer-controls flex flex-wrap items-center gap-4 pt-3">
          <Link
            to={ctaDestination}
            className="hero-cta-primary no-underline select-none"
            aria-label="Start Moving CO2"
          >
            <DecryptedText
              text="START MOVING CO₂"
              animateOn="hover"
              speed={35}
              maxIterations={10}
              encryptedClassName="text-[#6B7280]"
            />
            <ArrowRight className="w-4 h-4 text-[#0A0A0A]" />
          </Link>

          <a
            href="#section-02"
            className="hero-cta-secondary no-underline select-none"
            aria-label="See how CarbonFlow works"
          >
            <DecryptedText
              text="SEE HOW IT WORKS"
              animateOn="hover"
              speed={35}
              maxIterations={10}
              encryptedClassName="text-[#8EA5FF]"
            />
          </a>
        </div>

      </div>
    </div>
  );
};
