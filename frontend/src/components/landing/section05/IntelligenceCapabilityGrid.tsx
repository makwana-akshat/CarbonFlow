import React from "react";
import {
  IntelligenceCapability,
  type IntelligenceCapabilityData,
} from "./IntelligenceCapability";

const INTELLIGENCE_CAPABILITIES: IntelligenceCapabilityData[] = [
  {
    id: "recommendations",
    title: "AI Recommendations",
    description:
      "Discover compatible CO\u2082 suppliers using purity, volume, location, price, availability, reliability, and application fit.",
    visual: "matching",
  },
  {
    id: "explanations",
    title: "Explainable Matches",
    description:
      "See why CarbonFlow recommends a supplier, from compatibility and purity to delivered cost, reliability, and distance.",
    visual: "explain",
  },
  {
    id: "market",
    title: "Market Intelligence",
    description:
      "Turn supply, demand, price, utilization, and transportation activity into clear marketplace signals.",
    visual: "market",
  },
  {
    id: "price-alerts",
    title: "Price Alerts",
    description: "Know when suitable CO\u2082 appears below your target price.",
    visual: "price",
  },
  {
    id: "supply-alerts",
    title: "Supply Alerts",
    description:
      "See emerging regional shortages before they disrupt procurement.",
    visual: "supply",
  },
  {
    id: "ask-act",
    title: "Ask & Act",
    description:
      "Type or speak naturally, then move directly into the right CarbonFlow workflow.",
    visual: "action",
  },
];

interface IntelligenceCapabilityGridProps {
  activeCapability: string | null;
  onCapabilityActive: (id: string | null) => void;
}

export const IntelligenceCapabilityGrid: React.FC<
  IntelligenceCapabilityGridProps
> = ({ activeCapability, onCapabilityActive }) => {
  return (
    <div className="carbonflow-intelligence-layout relative z-10">
      {INTELLIGENCE_CAPABILITIES.map((capability, index) => (
        <IntelligenceCapability
          key={capability.id}
          capability={capability}
          index={index}
          isActive={activeCapability === capability.id}
          onActive={onCapabilityActive}
        />
      ))}
    </div>
  );
};

export default IntelligenceCapabilityGrid;
