import React from "react";
import { CapabilityItem, type CapabilityData } from "./CapabilityItem";

export const CAPABILITIES: CapabilityData[] = [
  {
    id: "recommendations",
    title: "AI Recommendations",
    description:
      "Discover compatible CO₂ suppliers using purity, volume, location, price, availability, reliability, and application fit.",
    icon: "recommendations",
  },
  {
    id: "explanations",
    title: "Explainable Matches",
    description:
      "See why CarbonFlow recommends a supplier, from compatibility and purity to delivered cost, reliability, and distance.",
    icon: "explanations",
  },
  {
    id: "allocation",
    title: "Procurement Allocation",
    description:
      "Aggregate fragmented demand and allocate CO₂ across multiple suppliers and buyers to build an executable procurement plan.",
    icon: "allocation",
  },
  {
    id: "maps",
    title: "Maps & Market Intelligence",
    description:
      "Explore geographic CO₂ supply, demand, prices, facilities, routes, and carbon flows through one interactive map.",
    icon: "maps",
  },
  {
    id: "insights",
    title: "Insights & Alerts",
    description:
      "Track price changes, supply risks, operational alerts, and business signals before they affect the next transaction.",
    icon: "insights",
  },
  {
    id: "contracts",
    title: "Contracts & Auditability",
    description:
      "Move from matched supply to executable agreements with contract history, approvals, versions, and fulfillment traceability.",
    icon: "contracts",
  },
];

interface CapabilityGridProps {
  className?: string;
}

export const CapabilityGrid: React.FC<CapabilityGridProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-12 lg:gap-y-16 w-full ${className}`}
    >
      {CAPABILITIES.map((capability) => (
        <CapabilityItem key={capability.id} capability={capability} />
      ))}
    </div>
  );
};

export default CapabilityGrid;
