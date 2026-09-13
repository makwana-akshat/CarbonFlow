import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface ArrowFillButtonProps {
  btnText: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  bgColor?: string;
  textColor?: string;
  fillBgColor?: string;
  fillTextColor?: string;
  hoverFillBgColor?: string;
  hoverFillTextColor?: string;
  arrowColor?: string;
  hoverArrowColor?: string;
  className?: string;
}

export const ArrowFillButton: React.FC<ArrowFillButtonProps> = ({
  btnText,
  href,
  onClick,
  bgColor = "#FFFFFF",
  textColor = "#0A0A0A",
  fillBgColor = "#0A0A0A",
  fillTextColor = "#FFFFFF",
  hoverFillBgColor,
  hoverFillTextColor,
  arrowColor = "#0A0A0A",
  hoverArrowColor = "#0A0A0A",
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const currentBgColor = isHovered
    ? (hoverFillBgColor ?? fillBgColor)
    : bgColor;
  const currentTextColor = isHovered
    ? (hoverFillTextColor ?? fillTextColor)
    : textColor;
  const currentArrowColor = isHovered
    ? (hoverArrowColor ?? arrowColor)
    : arrowColor;

  const content = (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: currentBgColor,
        color: currentTextColor,
      }}
      className={`group relative inline-flex items-center justify-between gap-3 h-12 px-6 rounded-full font-semibold text-sm transition-all duration-300 ease-out cursor-pointer overflow-hidden select-none ${className}`}
    >
      <span className="relative z-10 transition-colors duration-300">
        {btnText}
      </span>
      <span
        style={{ color: currentArrowColor }}
        className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-black/5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </div>
  );

  if (href) {
    if (href.startsWith("#") || href.startsWith("http")) {
      return (
        <a href={href} onClick={onClick} className="inline-block no-underline">
          {content}
        </a>
      );
    }
    return (
      <Link to={href} onClick={onClick} className="inline-block no-underline">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block border-none bg-transparent p-0">
      {content}
    </button>
  );
};

export default ArrowFillButton;
