import React from "react";

export type IntelligenceVisualType =
  | "matching"
  | "explain"
  | "market"
  | "price"
  | "supply"
  | "action";

interface IntelligenceVisualMarkProps {
  type: IntelligenceVisualType;
}

export const IntelligenceVisualMark: React.FC<IntelligenceVisualMarkProps> = ({
  type,
}) => {
  return (
    <div className="carbonflow-intelligence-mark" aria-hidden="true">
      {type === "matching" && (
        <svg viewBox="0 0 96 42" fill="none">
          <path className="mark-path mark-delay-1" d="M18 21H78" />
          <path className="mark-path mark-delay-2" d="M28 11L68 31" />
          <path className="mark-path mark-delay-3" d="M28 31L68 11" />
          <circle className="mark-node mark-delay-1" cx="18" cy="21" r="4" />
          <circle className="mark-node mark-delay-2" cx="28" cy="11" r="3" />
          <circle className="mark-node mark-delay-3" cx="28" cy="31" r="3" />
          <circle className="mark-node mark-core" cx="78" cy="21" r="5" />
        </svg>
      )}

      {type === "explain" && (
        <svg viewBox="0 0 96 42" fill="none">
          <path className="mark-path" d="M20 21H40C50 21 50 10 62 10H78" />
          <path className="mark-path mark-delay-2" d="M40 21C50 21 50 32 62 32H78" />
          <circle className="mark-node mark-core" cx="20" cy="21" r="4" />
          <circle className="mark-node mark-delay-1" cx="78" cy="10" r="3.5" />
          <circle className="mark-node mark-delay-3" cx="78" cy="32" r="3.5" />
        </svg>
      )}

      {type === "market" && (
        <svg viewBox="0 0 96 42" fill="none">
          <path className="mark-grid" d="M14 10H82M14 21H82M14 32H82M26 7V35M48 7V35M70 7V35" />
          <path className="mark-path mark-market" d="M16 28C28 13 39 25 48 18C59 9 68 15 80 11" />
          <circle className="mark-node mark-core" cx="80" cy="11" r="3.5" />
        </svg>
      )}

      {type === "price" && (
        <svg viewBox="0 0 96 42" fill="none">
          <path className="mark-grid" d="M14 14H82M14 28H82" />
          <path className="mark-path" d="M16 29H30L39 22L51 25L61 16H80" />
          <circle className="mark-node mark-price" cx="61" cy="16" r="4" />
        </svg>
      )}

      {type === "supply" && (
        <svg viewBox="0 0 96 42" fill="none">
          <path className="mark-grid" d="M18 30H78" />
          <path className="mark-threshold" d="M18 16H78" />
          <rect className="mark-bar mark-bar-1" x="24" y="20" width="8" height="10" rx="2" />
          <rect className="mark-bar mark-bar-2" x="44" y="12" width="8" height="18" rx="2" />
          <rect className="mark-bar mark-bar-3" x="64" y="8" width="8" height="22" rx="2" />
        </svg>
      )}

      {type === "action" && (
        <svg viewBox="0 0 96 42" fill="none">
          <path className="mark-input" d="M16 30H46" />
          <path className="mark-cursor" d="M51 24V34" />
          <path className="mark-path mark-action" d="M58 30H78" />
          <path className="mark-path mark-action" d="M70 22L78 30L70 38" />
          <circle className="mark-node mark-core" cx="22" cy="16" r="3" />
          <path className="mark-path mark-delay-2" d="M32 16C38 8 46 8 52 16" />
        </svg>
      )}
    </div>
  );
};

export default IntelligenceVisualMark;
