import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { ArrowRight } from "lucide-react";

interface FinalCtaProps {
  className?: string;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ className = "" }) => {
  const { isSignedIn } = useAuth();

  const primaryDestination = isSignedIn ? "/app/dashboard" : "/signup";
  const secondaryDestination = isSignedIn ? "/app/dashboard" : "/login";

  return (
    <div className={`flex flex-col items-start text-left ${className}`}>
      {/* Eyebrow & Number */}
      <div className="flex items-center gap-3 mb-5">
        <span className="carbonflow-final-num">07</span>
        <span className="carbonflow-final-eyebrow">
          MOVE CARBON FORWARD
        </span>
      </div>

      {/* Main Heading: Poppins, 56-64px desktop, 34-40px mobile, 700 weight, -6% tracking, solid white */}
      <h2 className="carbonflow-final-heading text-[34px] sm:text-[46px] md:text-[54px] lg:text-[60px] font-bold tracking-[-0.06em] leading-[1.05] text-white mb-6 select-none">
        MOVE CAPTURED CO₂.
        <br />
        INTO OPPORTUNITY.
      </h2>

      {/* Supporting Copy: Roboto, 18px desktop/tablet, 16px mobile, line-height 1.6, max width 540px */}
      <p className="carbonflow-final-subcopy text-[16px] md:text-[18px] text-[#9E9CA3] leading-[1.6] max-w-[540px] mb-10 select-none">
        Connect supply with real utilization demand, build the right
        procurement plan, move carbon efficiently, and take every transaction
        from match to measurable impact.
      </p>

      {/* CTA Button Group */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Primary CTA Button */}
        <Link
          to={primaryDestination}
          className="group relative inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-full bg-white text-[#0A0A0A] font-semibold text-[14px] shadow-[0_4px_24px_rgba(244,97,30,0.22)] hover:bg-[#F4611E] hover:text-white transition-all duration-300 select-none no-underline"
          aria-label="Start with CarbonFlow"
        >
          <span>START WITH CARBONFLOW</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        {/* Secondary Subordinate CTA */}
        <Link
          to={secondaryDestination}
          className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-white/20 bg-transparent text-white/80 font-medium text-[14px] hover:text-white hover:border-white/50 hover:bg-white/[0.05] transition-all duration-300 select-none no-underline"
          aria-label="Explore the CarbonFlow platform"
        >
          EXPLORE THE PLATFORM
        </Link>
      </div>
    </div>
  );
};

export default FinalCta;
