import React, { useEffect, useState } from "react";
import { SiriOrb, type OrbState } from "../../assistant/SiriOrb";

const ORB_STATES: OrbState[] = ["idle", "listening", "thinking", "speaking"];

interface IntelligenceOrbShowcaseProps {
  activeCapability: string | null;
  className?: string;
}

export const IntelligenceOrbShowcase: React.FC<IntelligenceOrbShowcaseProps> = ({
  activeCapability,
  className = "",
}) => {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [manualStateIndex, setManualStateIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (prefersReducedMotion.matches) {
      return;
    }

    let stateIndex = 0;
    const interval = window.setInterval(() => {
      stateIndex = (stateIndex + 1) % ORB_STATES.length;
      setOrbState(ORB_STATES[stateIndex]);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  const handleOrbClick = () => {
    const nextIndex = (manualStateIndex + 1) % ORB_STATES.length;

    setManualStateIndex(nextIndex);
    setOrbState(ORB_STATES[nextIndex]);
  };

  return (
    <div
      className={`carbonflow-intelligence-orb relative z-20 flex items-center justify-center ${className}`}
      data-orb-active={activeCapability ? "true" : "false"}
      aria-label="CarbonFlow AI"
    >
      <div className="carbonflow-intelligence-orb-aura" aria-hidden="true" />
      <div className="carbonflow-intelligence-orb-ring" aria-hidden="true" />
      <SiriOrb
        state={orbState}
        size="lg"
        onClick={handleOrbClick}
        ariaLabel="CarbonFlow AI"
        className="carbonflow-intelligence-orb-button"
      />
    </div>
  );
};

export default IntelligenceOrbShowcase;
